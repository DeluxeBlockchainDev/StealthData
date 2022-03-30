import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StealthService, CreateAppRequest } from 'src/common/services/stealth.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import { ClientService } from '../services/client.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubscriptionService } from '../services/subscription.service';
import { GetResponseService } from 'src/common/services/get-response.service';
import { LEAD_PRIORITIES } from '../constant';
import { EmailService } from 'src/common/services/email.service';
import { InvoiceService } from '../services/invoice.service';
import * as bcrypt from 'bcrypt';
import * as flatten from 'lodash.flatten';
import { PaymentService } from 'src/common/services/payment.service';
import { CreateLeadPriority } from '../dto/leadpriority.dto';
import { LeadPriorityService } from '../services/leadpriority.service';

const DEFAULT_USERNAME = 'stealth-user-'
const DEFAULT_PASSWORD = 'stealth-password-'

const storage = diskStorage({
  destination: './uploads/avatars',
  filename: (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  },
})
@Controller('client')
export class ClientController {
  constructor(
    private clientService: ClientService,
    private stealthService: StealthService,
    private subscriptionService: SubscriptionService,
    private getResponseService: GetResponseService,
    private emailService: EmailService,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private leadPriorityService: LeadPriorityService,
  ) {}

  async syncClientCampaigns(clientParams) {
    const { email, companyName, address } = clientParams;
    let campaigns = [];
    try {
      campaigns = await this.getResponseService.getCampaigns({
        companyName: companyName,
      });
    } catch (e) {
      console.log('Failed to sync campaigns', e);
    }

    for (let priority in LEAD_PRIORITIES) {
      const campaignPrefix = `${LEAD_PRIORITIES[priority][0]}_`;
      const campaignName = `${campaignPrefix}${companyName
        .replace(/ /g, '')
        .toLowerCase()}`;
      const campaignFound = campaigns.find(
        (camp) => camp.name === campaignName,
      );
      if (!campaignFound) {
        try {
          await this.getResponseService.createCampaign({
            name: campaignName,
            postal: {
              companyName,
              country: 'United States',
              city: address.city,
              state: address.state,
              zipCode: address.zipcode,
              street: address.line1,
            },
            optinTypes: {
              api: 'single',
              webform: 'single',
            },
            subscriptionNotifications: {
              status: 'disabled',
              recipients: [],
            },
          });
        } catch (e) {
          console.log('Failed to sync campaigns', e);
        }
      } else {
        try {
          await this.getResponseService.updateCampaign(
            campaignFound.campaignId,
            {
              name: campaignName,
              postal: {
                companyName,
                country: 'United States',
                city: address.city,
                state: address.state,
                zipCode: address.zipcode,
                street: address.line1,
              },
            },
          );
        } catch (e) {
          console.log('Failed to sync campaigns', e);
        }
      }
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  async create(@Body() createClientDto: CreateClientDto, @UploadedFile() file) {
    if (file) createClientDto.avatar = file.path;
    const existingClient = await this.clientService.findOne({
      $or: [
        { email: createClientDto.email },
        { username: createClientDto.username },
        { companyName: createClientDto.companyName },
        {
          companyName: createClientDto.companyName
            .replace(/ /g, '')
            .toLowerCase(),
        },
      ],
    });
    if (existingClient) {
      throw new BadRequestException(
        'User with provided email or username already exists ',
      );
    } else {
      this.syncClientCampaigns(createClientDto);
      const subscription = await this.subscriptionService.findOne({
        _id: createClientDto.subscriptionId,
      });

      var createCustomerResult = await this.paymentService.CreateCustomer(
        createClientDto,
      );

      if (createCustomerResult['result'] == false) {
        throw new BadRequestException(paymentResult['error']);
      } else {
        createClientDto.customerProfileId =
          createCustomerResult['customerProfileId'];
        createClientDto.customerPaymentProfileId =
          createCustomerResult['customerPaymentProfileId'];
      }

      var paymentResult = await this.paymentService.MakePayment(
        createClientDto,
        [
          {
            id: subscription.id,
            name: subscription.name,
            description: '',
            quantity: 1,
            unitPrice: subscription.price,
          },
        ],
        subscription.price,
      );

      if (paymentResult['result'] == false) {
        throw new BadRequestException(paymentResult['error']);
      }

      const invoice = {
        billedTo: `${createClientDto.firstName}${
          createClientDto.lastName ? ' ' + createClientDto.lastName : ''
        }`,
        billingAddress: createClientDto.address,
        paymentMethod: 'credit',
        tax: 0,
        amount: subscription.price,
        total: subscription.price,
        itemName: subscription.name,
        email: createClientDto.email,
      };

      const raisedInvoice = await this.invoiceService.create(invoice);

      this.emailService.mail({
        to: createClientDto.email,
        from: process.env.SMTP_USERNAME,
        subject: 'Payment Receipt',
        html: `
          Hello,<br /><br />
          You have successfully paid $${subscription.price} and purchased ${subscription.name} subscription on Stealth Data.
          <br />
          You will be charged $${subscription.price} on an monthly basis.
          <br /><br />
          Stealth Data.
        `,
      });

      createClientDto['password'] = await bcrypt.hash(
        createClientDto['password'],
        10,
      );
      createClientDto['isActive'] = true;
      createClientDto['isAdditionalFee'] = true;
      const client = await this.clientService.create(createClientDto);

      if (createClientDto.apps && createClientDto.apps.length) {
        const req: CreateAppRequest = {
          loginEmail: createClientDto.email,
          loginUserName: `${DEFAULT_USERNAME}${client._id}`,
          loginUserPassword: `${DEFAULT_PASSWORD}${client._id}`,
          customerName: createClientDto.companyName,
          loginCompanyName: createClientDto.companyName,
        }

        const stealthApp = await this.stealthService.createApp(req);
        let updateClient: UpdateClientDto = {
          customerGUID: stealthApp.customerGUID,
          apps: client.apps,
        };
        this.stealthService.toggleTracking(1, stealthApp.loginAPIAccessKey);
        updateClient.apps[0].loginGUID = stealthApp.loginGUID;
        updateClient.apps[0].loginAPIAccessKey = stealthApp.loginAPIAccessKey;
        updateClient.apps[0].req = req;
        const updatedClient = await this.clientService.findOneAndUpdate(
          { _id: client._id },
          updateClient,
        );
        const loginUrl = process.env.APP_URL + 'auth/login';

        this.emailService.mail({
          to: createClientDto.email,
          from: process.env.SMTP_USERNAME,
          subject: 'Sign Up',
          html: `
            Hello ${createClientDto.firstName} ${
            !!createClientDto.lastName ? createClientDto.lastName : ''
          },<br /><br />
            Welcome to Stealth Data, Login to Stealth Data Portal with your username ${
              createClientDto.username
            } and your provided password to configure Stealth Data on your web app and start tracking users and their activity.<br /><br />
            <a href="${loginUrl}">Login</a>

            <br /><br />
            You can start tracking right away by adding the following script snippet to your web app.
            <br /><br />
            &lt;script 
              type=&quot;text/javascript&quot;
              src=&quot;https://${process.env.DOMAIN}}/ct/gst/${
            updateClient.customerGUID
          }.js&quot;
              async&gt;
            &lt;/script&gt;

            <br /><br />
            Stealth Data.
          `,
        });

        try {
          createClientDto.invoiceId === 'dummyInvoiceId' &&
            this.invoiceService.findOneAndUpdate(
              { _id: createClientDto.invoiceId },
              { clientId: client._id },
            );
        } catch (e) {
          console.log('Invoice Update Failed', e.message);
        }
        return updateClient;
      } else {
        return client;
      }
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    console.log('ls..........')
    const clients = this.clientService.paginate(
      parseInt(page),
      parseInt(limit),
    );
    return clients;
  }
  @Get('/accessClientAccount/:id')
  @UseGuards(JwtAuthGuard)
  async accessClientAccount(@Request() req, @Param('id') id) {

    const client: any = await this.clientService.findOne({ _id: id });
    if(client){
      console.log(JSON.stringify(client))
      const { access_token } = await this.clientService.genrateToken(client);
      
      const subscription = await this.subscriptionService.findOne({
        _id: client.subscriptionId,
      });
      client.activeSubscription = subscription;

      let user = { email: client.email, id: client._id, isAdmin: !!client.isAdmin, firstName: client.firstName }
      return {authToken: access_token, user: user, clientData: client}
    }else{
      return false;
    }
    
  }
  

  @Get('/invoices')
  @UseGuards(JwtAuthGuard)
  getInvoices(@Request() req) {
    const { email } = req.user;
    const invoices = this.invoiceService.findAll({ email });
    return invoices;
  }

  @Get('/invoices/:id')
  @UseGuards(JwtAuthGuard)
  getInvoice(@Request() req, @Param('id') id) {
    const { email } = req.user;
    const invoice = this.invoiceService.findOne({ email, _id: id });
    return invoice;
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage }))
  async update(
    @Param('id') _id: string,
    @Body() updateClientDto: UpdateClientDto,
    @UploadedFile() file,
  ) {
    const existingClient = await this.clientService.findOne({
      $or: [
        { email: updateClientDto.email },
        { username: updateClientDto.username },
        { companyName: updateClientDto.companyName },
        {
          companyName: updateClientDto.companyName
            .replace(/ /g, '')
            .toLowerCase(),
        },
      ],
      _id: { $ne: _id },
    });
    if (existingClient) {
      throw new BadRequestException(
        'User with provided email or username already exists ',
      );
    } else {
      if (
        updateClientDto.subscriptionId == '' ||
        updateClientDto.subscriptionId == null
      ) {
        const client = await this.clientService.findOne({ _id });
        this.clientService.delete(_id);
        for (let app of client.apps) {
          this.stealthService
            .toggleTracking(0, app.loginAPIAccessKey)
            .catch((e) => {
              console.log('EXCEPTION', e);
            });
          this.stealthService.moveApp(client.customerGUID).catch((e) => {
            console.log('EXCEPTION', e);
          });

          // clean up contacts from all lists
          this.getResponseService
            .getCampaigns({ companyName: client.companyName })
            .then((campaignTypes) =>
              Promise.all(
                campaignTypes.map((c) =>
                  this.getResponseService.getContacts({
                    'query[campaignId]': c.campaignId,
                  }),
                ),
              ),
            )
            .then((existingContacts) =>
              Promise.all(
                flatten(existingContacts).map((ex) =>
                  this.getResponseService.deleteContact(ex.contactId),
                ),
              ),
            )
            .catch((e) => console.log('Unable to get campaigns'));
        }
        return client;
      } else {
        if (existingClient.subscriptionId != updateClientDto.subscriptionId) {
          const oldSubscription = await this.subscriptionService.findOne({
            _id: existingClient.subscriptionId,
          });
          const newSubscription = await this.subscriptionService.findOne({
            _id: updateClientDto.subscriptionId,
          });
          if (oldSubscription.listOrder < newSubscription.listOrder) {
            var dateFrom = new Date();
            var dateTo = new Date(existingClient.lastBillingDate);
            var Difference_In_Time = dateTo.getTime() - dateFrom.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            const price = parseFloat(
              (
                newSubscription.price -
                parseInt(Difference_In_Days.toString()) *
                  (oldSubscription.price / 30)
              ).toString(),
            )
              .toFixed(2)
              .toString();
            var paymentResult = await this.paymentService.MakePayment(
              updateClientDto,
              [
                {
                  id: newSubscription.id,
                  name: newSubscription.name,
                  description: '',
                  quantity: 1,
                  unitPrice: price,
                },
              ],
              price,
            );

            if (paymentResult['result'] == false) {
              throw new BadRequestException(paymentResult['error']);
            }

            const invoice = {
              billedTo: `${updateClientDto.firstName}${
                updateClientDto.lastName ? ' ' + updateClientDto.lastName : ''
              }`,
              billingAddress: updateClientDto.address,
              paymentMethod: 'credit',
              tax: 0,
              amount: price,
              total: price,
              itemName: newSubscription.name,
              email: updateClientDto.email,
            };

            const raisedInvoice = await this.invoiceService.create(invoice);

            this.emailService.mail({
              to: updateClientDto.email,
              from: process.env.SMTP_USERNAME,
              subject: 'Payment Receipt',
              html: `
                Hello,<br /><br />
                Upgrading from ${oldSubscription.name} to ${newSubscription.name}
                You have successfully paid $${price} and purchased ${newSubscription.name} subscription on Stealth Data.
                <br />
                You will be charged $${newSubscription.price} on an monthly basis.
                <br /><br />
                Stealth Data.
              `,
            });
          }
        }
        if (!updateClientDto.password) {
          delete updateClientDto.password;
        } else {
          updateClientDto.password = await bcrypt.hash(
            updateClientDto.password,
            10,
          );
        }
        if (file) updateClientDto.avatar = file.path;
        this.syncClientCampaigns(updateClientDto);
        const client = this.clientService.findOneAndUpdate(
          { _id },
          updateClientDto,
        );
        return client;
      }
    }
  }

  @Get('/toggle/:id')
  @UseGuards(JwtAuthGuard)
  async toggle(
    @Param('id') _id: string,
    @Query('status') status: string | number,
  ) {
    const client = await this.clientService.findOne({ _id });
    status = parseInt(status.toString());
    if (isNaN(status)) {
      throw new BadRequestException('Invalid Params');
    }

    if (client.status === 'paused') {
      throw new BadRequestException('Paused by Admin');
    }

    if (client.status === 'cancelled') {
      throw new BadRequestException('Cancelled Client');
    }

    for (let app of client.apps) {
      this.stealthService
        .toggleTracking(status, app.loginAPIAccessKey)
        .catch((e) => {
          console.log('EXCEPTION', e);
        });
    }
    const clientStatus = status === 0 ? 'paused_backend' : 'live';
    await this.clientService.findOneAndUpdate(
      { _id },
      { status: clientStatus },
    );
    return { clientStatus };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') _id: string) {
    const client = await this.clientService.findOne({ _id });
    this.clientService.delete(_id);
    for (let app of client.apps) {
      this.stealthService
        .toggleTracking(0, app.loginAPIAccessKey)
        .catch((e) => {
          console.log('EXCEPTION', e);
        });
      this.stealthService.moveApp(client.customerGUID).catch((e) => {
        console.log('EXCEPTION', e);
      });

      // clean up contacts from all lists
      this.getResponseService
        .getCampaigns({ companyName: client.companyName })
        .then((campaignTypes) =>
          Promise.all(
            campaignTypes.map((c) =>
              this.getResponseService.getContacts({
                'query[campaignId]': c.campaignId,
              }),
            ),
          ),
        )
        .then((existingContacts) =>
          Promise.all(
            flatten(existingContacts).map((ex) =>
              this.getResponseService.deleteContact(ex.contactId),
            ),
          ),
        )
        .catch((e) => console.log('Unable to get campaigns'));
    }
    return client;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async find(@Param('id') _id: string) {
    const client: any = await this.clientService.findOne({ _id });
    const subscription = await this.subscriptionService.findOne({
      _id: client.subscriptionId,
    });
    client.activeSubscription = subscription;
    return client;
  }

  @Get('/exists/:id')
  async checkEmailExists(@Param('id') email: string) {
    const client: any = await this.clientService.findOne({ email });
    return !!client;
  }

  @Get('/getScript/:customerGUID')
  async checkEmailExists2(@Param('customerGUID') customerGUID: string) {
    const script = 'script';
    return await this.stealthService.getScript(customerGUID);
  }

  /* update custom lead priority */
  @Post('/updateLeadPriority/:id')
  @UseGuards(JwtAuthGuard)
  async updateLeadPriority(
    @Param('id') _id: string,
    @Body() CreateLeadPriority: CreateLeadPriority,
  ) {

    try {

      const client = await this.clientService.findOne({ _id });

      if (client) {
        try {
          let loginAPIAccessKey = client.apps[0].loginAPIAccessKey ? client.apps[0].loginAPIAccessKey : '';
          let leadpriority = {
                              ...CreateLeadPriority, 
                              'clientId' : _id,
                              'loginAPIAccessKey' : loginAPIAccessKey
                            }
          let updateClient = await this.leadPriorityService.create(leadpriority);
          // Start - update isLeadProritySet in client collection
          await this.clientService.findOneAndUpdate(
            { _id:_id },
            { isLeadProritySet : true},
          )
          // End - update isLeadProritySet in client collection
          return updateClient;
        } catch (err) {
          console.log('unable to update');
        }
      }
    } catch (err) {
      console.log('not found');
    }
  }

  /* get custom lead priority history */
  @Get('leadPriority/:id')
  @UseGuards(JwtAuthGuard)
  async getLeadPriority(
        @Param('id') _id: string,
        @Query('page') page: string, 
        @Query('limit') limit: string,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
      ) {

    try {
      let sort: any = {
        createdAt: -1
      };
      if (!!sortField && !!sortOrder) {
        sort = {
          [sortField]: parseInt(sortOrder),
        }
      }

      const client = await this.clientService.findOne({ _id });

      if(client) {

        const leadPriorities = this.leadPriorityService.paginate(
          parseInt(page),
          parseInt(limit),
          sort,
          {clientId: _id}
        );
        return leadPriorities;

      }

    } catch(err) {
      console.log('Invalid client')
    }

  }
}