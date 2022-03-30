"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const stealth_service_1 = require("../../common/services/stealth.service");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const client_dto_1 = require("../dto/client.dto");
const client_service_1 = require("../services/client.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const subscription_service_1 = require("../services/subscription.service");
const get_response_service_1 = require("../../common/services/get-response.service");
const constant_1 = require("../constant");
const email_service_1 = require("../../common/services/email.service");
const invoice_service_1 = require("../services/invoice.service");
const bcrypt = require("bcrypt");
const flatten = require("lodash.flatten");
const payment_service_1 = require("../../common/services/payment.service");
const leadpriority_dto_1 = require("../dto/leadpriority.dto");
const leadpriority_service_1 = require("../services/leadpriority.service");
const DEFAULT_USERNAME = 'stealth-user-';
const DEFAULT_PASSWORD = 'stealth-password-';
const storage = multer_1.diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = path_1.extname(file.originalname);
        const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
        callback(null, `${name}-${randomName}${fileExtName}`);
    },
});
let ClientController = class ClientController {
    constructor(clientService, stealthService, subscriptionService, getResponseService, emailService, invoiceService, paymentService, leadPriorityService) {
        this.clientService = clientService;
        this.stealthService = stealthService;
        this.subscriptionService = subscriptionService;
        this.getResponseService = getResponseService;
        this.emailService = emailService;
        this.invoiceService = invoiceService;
        this.paymentService = paymentService;
        this.leadPriorityService = leadPriorityService;
    }
    async syncClientCampaigns(clientParams) {
        const { email, companyName, address } = clientParams;
        let campaigns = [];
        try {
            campaigns = await this.getResponseService.getCampaigns({
                companyName: companyName,
            });
        }
        catch (e) {
            console.log('Failed to sync campaigns', e);
        }
        for (let priority in constant_1.LEAD_PRIORITIES) {
            const campaignPrefix = `${constant_1.LEAD_PRIORITIES[priority][0]}_`;
            const campaignName = `${campaignPrefix}${companyName
                .replace(/ /g, '')
                .toLowerCase()}`;
            const campaignFound = campaigns.find((camp) => camp.name === campaignName);
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
                }
                catch (e) {
                    console.log('Failed to sync campaigns', e);
                }
            }
            else {
                try {
                    await this.getResponseService.updateCampaign(campaignFound.campaignId, {
                        name: campaignName,
                        postal: {
                            companyName,
                            country: 'United States',
                            city: address.city,
                            state: address.state,
                            zipCode: address.zipcode,
                            street: address.line1,
                        },
                    });
                }
                catch (e) {
                    console.log('Failed to sync campaigns', e);
                }
            }
        }
    }
    async create(createClientDto, file) {
        if (file)
            createClientDto.avatar = file.path;
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
            throw new common_1.BadRequestException('User with provided email or username already exists ');
        }
        else {
            this.syncClientCampaigns(createClientDto);
            const subscription = await this.subscriptionService.findOne({
                _id: createClientDto.subscriptionId,
            });
            var createCustomerResult = await this.paymentService.CreateCustomer(createClientDto);
            if (createCustomerResult['result'] == false) {
                throw new common_1.BadRequestException(paymentResult['error']);
            }
            else {
                createClientDto.customerProfileId =
                    createCustomerResult['customerProfileId'];
                createClientDto.customerPaymentProfileId =
                    createCustomerResult['customerPaymentProfileId'];
            }
            var paymentResult = await this.paymentService.MakePayment(createClientDto, [
                {
                    id: subscription.id,
                    name: subscription.name,
                    description: '',
                    quantity: 1,
                    unitPrice: subscription.price,
                },
            ], subscription.price);
            if (paymentResult['result'] == false) {
                throw new common_1.BadRequestException(paymentResult['error']);
            }
            const invoice = {
                billedTo: `${createClientDto.firstName}${createClientDto.lastName ? ' ' + createClientDto.lastName : ''}`,
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
            createClientDto['password'] = await bcrypt.hash(createClientDto['password'], 10);
            createClientDto['isActive'] = true;
            createClientDto['isAdditionalFee'] = true;
            const client = await this.clientService.create(createClientDto);
            if (createClientDto.apps && createClientDto.apps.length) {
                const req = {
                    loginEmail: createClientDto.email,
                    loginUserName: `${DEFAULT_USERNAME}${client._id}`,
                    loginUserPassword: `${DEFAULT_PASSWORD}${client._id}`,
                    customerName: createClientDto.companyName,
                    loginCompanyName: createClientDto.companyName,
                };
                const stealthApp = await this.stealthService.createApp(req);
                let updateClient = {
                    customerGUID: stealthApp.customerGUID,
                    apps: client.apps,
                };
                this.stealthService.toggleTracking(1, stealthApp.loginAPIAccessKey);
                updateClient.apps[0].loginGUID = stealthApp.loginGUID;
                updateClient.apps[0].loginAPIAccessKey = stealthApp.loginAPIAccessKey;
                updateClient.apps[0].req = req;
                const updatedClient = await this.clientService.findOneAndUpdate({ _id: client._id }, updateClient);
                const loginUrl = process.env.APP_URL + 'auth/login';
                this.emailService.mail({
                    to: createClientDto.email,
                    from: process.env.SMTP_USERNAME,
                    subject: 'Sign Up',
                    html: `
            Hello ${createClientDto.firstName} ${!!createClientDto.lastName ? createClientDto.lastName : ''},<br /><br />
            Welcome to Stealth Data, Login to Stealth Data Portal with your username ${createClientDto.username} and your provided password to configure Stealth Data on your web app and start tracking users and their activity.<br /><br />
            <a href="${loginUrl}">Login</a>

            <br /><br />
            You can start tracking right away by adding the following script snippet to your web app.
            <br /><br />
            &lt;script 
              type=&quot;text/javascript&quot;
              src=&quot;https://${process.env.DOMAIN}}/ct/gst/${updateClient.customerGUID}.js&quot;
              async&gt;
            &lt;/script&gt;

            <br /><br />
            Stealth Data.
          `,
                });
                try {
                    createClientDto.invoiceId === 'dummyInvoiceId' &&
                        this.invoiceService.findOneAndUpdate({ _id: createClientDto.invoiceId }, { clientId: client._id });
                }
                catch (e) {
                    console.log('Invoice Update Failed', e.message);
                }
                return updateClient;
            }
            else {
                return client;
            }
        }
    }
    findAll(page, limit) {
        console.log('ls..........');
        const clients = this.clientService.paginate(parseInt(page), parseInt(limit));
        return clients;
    }
    async accessClientAccount(req, id) {
        const client = await this.clientService.findOne({ _id: id });
        if (client) {
            console.log(JSON.stringify(client));
            const { access_token } = await this.clientService.genrateToken(client);
            const subscription = await this.subscriptionService.findOne({
                _id: client.subscriptionId,
            });
            client.activeSubscription = subscription;
            let user = { email: client.email, id: client._id, isAdmin: !!client.isAdmin, firstName: client.firstName };
            return { authToken: access_token, user: user, clientData: client };
        }
        else {
            return false;
        }
    }
    getInvoices(req) {
        const { email } = req.user;
        const invoices = this.invoiceService.findAll({ email });
        return invoices;
    }
    getInvoice(req, id) {
        const { email } = req.user;
        const invoice = this.invoiceService.findOne({ email, _id: id });
        return invoice;
    }
    async update(_id, updateClientDto, file) {
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
            throw new common_1.BadRequestException('User with provided email or username already exists ');
        }
        else {
            if (updateClientDto.subscriptionId == '' ||
                updateClientDto.subscriptionId == null) {
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
                    this.getResponseService
                        .getCampaigns({ companyName: client.companyName })
                        .then((campaignTypes) => Promise.all(campaignTypes.map((c) => this.getResponseService.getContacts({
                        'query[campaignId]': c.campaignId,
                    }))))
                        .then((existingContacts) => Promise.all(flatten(existingContacts).map((ex) => this.getResponseService.deleteContact(ex.contactId))))
                        .catch((e) => console.log('Unable to get campaigns'));
                }
                return client;
            }
            else {
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
                        const price = parseFloat((newSubscription.price -
                            parseInt(Difference_In_Days.toString()) *
                                (oldSubscription.price / 30)).toString())
                            .toFixed(2)
                            .toString();
                        var paymentResult = await this.paymentService.MakePayment(updateClientDto, [
                            {
                                id: newSubscription.id,
                                name: newSubscription.name,
                                description: '',
                                quantity: 1,
                                unitPrice: price,
                            },
                        ], price);
                        if (paymentResult['result'] == false) {
                            throw new common_1.BadRequestException(paymentResult['error']);
                        }
                        const invoice = {
                            billedTo: `${updateClientDto.firstName}${updateClientDto.lastName ? ' ' + updateClientDto.lastName : ''}`,
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
                }
                else {
                    updateClientDto.password = await bcrypt.hash(updateClientDto.password, 10);
                }
                if (file)
                    updateClientDto.avatar = file.path;
                this.syncClientCampaigns(updateClientDto);
                const client = this.clientService.findOneAndUpdate({ _id }, updateClientDto);
                return client;
            }
        }
    }
    async toggle(_id, status) {
        const client = await this.clientService.findOne({ _id });
        status = parseInt(status.toString());
        if (isNaN(status)) {
            throw new common_1.BadRequestException('Invalid Params');
        }
        if (client.status === 'paused') {
            throw new common_1.BadRequestException('Paused by Admin');
        }
        if (client.status === 'cancelled') {
            throw new common_1.BadRequestException('Cancelled Client');
        }
        for (let app of client.apps) {
            this.stealthService
                .toggleTracking(status, app.loginAPIAccessKey)
                .catch((e) => {
                console.log('EXCEPTION', e);
            });
        }
        const clientStatus = status === 0 ? 'paused_backend' : 'live';
        await this.clientService.findOneAndUpdate({ _id }, { status: clientStatus });
        return { clientStatus };
    }
    async delete(_id) {
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
            this.getResponseService
                .getCampaigns({ companyName: client.companyName })
                .then((campaignTypes) => Promise.all(campaignTypes.map((c) => this.getResponseService.getContacts({
                'query[campaignId]': c.campaignId,
            }))))
                .then((existingContacts) => Promise.all(flatten(existingContacts).map((ex) => this.getResponseService.deleteContact(ex.contactId))))
                .catch((e) => console.log('Unable to get campaigns'));
        }
        return client;
    }
    async find(_id) {
        const client = await this.clientService.findOne({ _id });
        const subscription = await this.subscriptionService.findOne({
            _id: client.subscriptionId,
        });
        client.activeSubscription = subscription;
        return client;
    }
    async checkEmailExists(email) {
        const client = await this.clientService.findOne({ email });
        return !!client;
    }
    async checkEmailExists2(customerGUID) {
        const script = 'script';
        return await this.stealthService.getScript(customerGUID);
    }
    async updateLeadPriority(_id, CreateLeadPriority) {
        try {
            const client = await this.clientService.findOne({ _id });
            if (client) {
                try {
                    let loginAPIAccessKey = client.apps[0].loginAPIAccessKey ? client.apps[0].loginAPIAccessKey : '';
                    let leadpriority = Object.assign(Object.assign({}, CreateLeadPriority), { 'clientId': _id, 'loginAPIAccessKey': loginAPIAccessKey });
                    let updateClient = await this.leadPriorityService.create(leadpriority);
                    await this.clientService.findOneAndUpdate({ _id: _id }, { isLeadProritySet: true });
                    return updateClient;
                }
                catch (err) {
                    console.log('unable to update');
                }
            }
        }
        catch (err) {
            console.log('not found');
        }
    }
    async getLeadPriority(_id, page, limit, sortField, sortOrder) {
        try {
            let sort = {
                createdAt: -1
            };
            if (!!sortField && !!sortOrder) {
                sort = {
                    [sortField]: parseInt(sortOrder),
                };
            }
            const client = await this.clientService.findOne({ _id });
            if (client) {
                const leadPriorities = this.leadPriorityService.paginate(parseInt(page), parseInt(limit), sort, { clientId: _id });
                return leadPriorities;
            }
        }
        catch (err) {
            console.log('Invalid client');
        }
    }
};
__decorate([
    common_1.Post(),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage,
    })),
    __param(0, common_1.Body()), __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [client_dto_1.CreateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "create", null);
__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Query('page')), __param(1, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "findAll", null);
__decorate([
    common_1.Get('/accessClientAccount/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "accessClientAccount", null);
__decorate([
    common_1.Get('/invoices'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getInvoices", null);
__decorate([
    common_1.Get('/invoices/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Request()), __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getInvoice", null);
__decorate([
    common_1.Put('/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', { storage })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, client_dto_1.UpdateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "update", null);
__decorate([
    common_1.Get('/toggle/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Query('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "toggle", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "delete", null);
__decorate([
    common_1.Get('/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "find", null);
__decorate([
    common_1.Get('/exists/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "checkEmailExists", null);
__decorate([
    common_1.Get('/getScript/:customerGUID'),
    __param(0, common_1.Param('customerGUID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "checkEmailExists2", null);
__decorate([
    common_1.Post('/updateLeadPriority/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, leadpriority_dto_1.CreateLeadPriority]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "updateLeadPriority", null);
__decorate([
    common_1.Get('leadPriority/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Query('page')),
    __param(2, common_1.Query('limit')),
    __param(3, common_1.Query('sortField')),
    __param(4, common_1.Query('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "getLeadPriority", null);
ClientController = __decorate([
    common_1.Controller('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService,
        stealth_service_1.StealthService,
        subscription_service_1.SubscriptionService,
        get_response_service_1.GetResponseService,
        email_service_1.EmailService,
        invoice_service_1.InvoiceService,
        payment_service_1.PaymentService,
        leadpriority_service_1.LeadPriorityService])
], ClientController);
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map