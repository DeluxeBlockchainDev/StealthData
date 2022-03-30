import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StealthService } from 'src/common/services/stealth.service';
import { ClientService } from './client.service';
import { VisitorService } from './visitor.service';
import { VisitService } from './visit.service';
import { CorporateService } from './corporate.service';
import { SubscriptionService } from './subscription.service';
import { EmailCampaignService } from "./email-campaign.service";
import { DAYS_TO_CHANGE_RESPONDER_LIST, LEAD_PRIORITIES, LEAD_PRIORITIES_OFFSETS } from '../constant';
import { GetResponseService } from 'src/common/services/get-response.service';
import { PeoplesDataService } from 'src/common/services/peoplesdata-service';
import { EmailService } from 'src/common/services/email.service';
import { VisitorDocument } from '../schemas/visitor.schema';
import { CorporateDocument } from '../schemas/corporate.schema';
import * as xlsx from 'xlsx';
import * as Client from 'ftp';
import * as fs from 'fs';
import { CampaignStatService } from './campaign-stat.service';
import { UnsubscribedUserService } from './unsubscribed-user.service';
import { PaymentService } from 'src/common/services/payment.service';
import { InvoiceService } from './invoice.service';
import { LeadPriorityService } from './leadpriority.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private clientService: ClientService,
    private visitService: VisitService,
    private visitorService: VisitorService,
    private stealthService: StealthService,
    private subscriptionService: SubscriptionService,
    private emailCampaignService: EmailCampaignService,
    private getResponseService: GetResponseService,
    private corporateService: CorporateService,
    private peoplesDataService: PeoplesDataService,
    private emailService: EmailService,
    private campaignStatService: CampaignStatService,
    private unsubscribedUserService: UnsubscribedUserService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private leadPriorityService: LeadPriorityService
  ){}

  static getLeadPriority = (visitCount, isHotPriorityAllowed) => {
    let priority = '';

    if (visitCount >= LEAD_PRIORITIES_OFFSETS.MILD) {
      priority = LEAD_PRIORITIES.MILD
    }

    if (visitCount >= LEAD_PRIORITIES_OFFSETS.WARM) {
      priority = LEAD_PRIORITIES.WARM
    }

    if (isHotPriorityAllowed && visitCount >= LEAD_PRIORITIES_OFFSETS.HOT) {
      priority = LEAD_PRIORITIES.HOT
    }
    return priority;
  }

  async getCustomLeadPriority(visitCount, isHotPriorityAllowed, clientId): Promise<string> {
    let priority = '';
  
    let leadPriorities = await this.leadPriorityService.findOne({clientId});
    
    if (visitCount <= leadPriorities.mild) {
      priority = LEAD_PRIORITIES.MILD
    }

    if (visitCount <= leadPriorities.warm) {
      priority = LEAD_PRIORITIES.WARM
    }

    if (isHotPriorityAllowed && visitCount >= leadPriorities.hot) {
      priority = LEAD_PRIORITIES.HOT
    }
    
    return priority;
  }

  async syncContact(visitor, campaignTypes) {
    try {
      const campaignIds = campaignTypes.map((c) => c.campaignId);
      const existingContacts: any = await this.getResponseService.getContacts({
        "query[email]": visitor.email,
      });
      const promises = existingContacts
        .filter((ex) => campaignIds.includes(ex.campaign.campaignId))
        .map(ex => this.getResponseService.deleteContact(ex.contactId))
      await Promise.all(promises);
    } catch (e) {
      console.log('Failed to delete contact', e);
    }

    const campaignType = campaignTypes.
      find((campaignType) => `${campaignType.name[0]}${campaignType.name[1]}` === `${visitor['priority'][0]}_`);
    if (!campaignType) return {};

    const contactParams = {
      campaign: {
        campaignId: campaignType.campaignId
      },
      dayOfCycle: 0,
      email: visitor['email']
    }
    try {
      await this.getResponseService.createContact(contactParams);
      return {
        autoResponderListName: campaignType.name,
        autoResponderListDate: new Date()
      }
    } catch (e) {
      console.log(e);
      return {};
    }

  }

  @Cron('*/20 * * * *')
  async handleCron(params?: any) {
    this.logger.debug('Called every 20 minutes');
    const clients = await this.clientService.findAll({ status: 'live' });
    const subscriptions = await this.subscriptionService.findAll();
    let startDate = new Date(), endDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    endDate.setDate(endDate.getDate() + 1);

    if (!!params && !!params.startDate && !!params.endDate) {
      startDate = new Date(params.startDate);
      endDate = new Date(params.endDate);
      startDate.setHours(0, 0, 0, 0); endDate.setHours(23, 59, 59, 999);
    }

    for (let client of clients) {

      const apps = client.apps || [];
      let campaignTypes = [], activeCampaignTypes = [], activeCampaignIds = [], updatedClient = {};
      let campaignIds = [];

      try {
        campaignTypes = await this.getResponseService.getCampaigns({ companyName: client.companyName });//all campaign types as per the subscription

        campaignIds = await campaignTypes.map((ct) => ct.campaignId);

        activeCampaignTypes = await this.emailCampaignService
          .findAll({ clientId: client._id });//added campaigns from dashboard
        activeCampaignIds = await activeCampaignTypes.map((c) => c.campaignTypeId);

      } catch (e) {
        console.log('Unable to get campaigns');
      }
      try {
        const subscription = subscriptions.find((sub) => sub._id.toString() === client.subscriptionId);
        let visitorsIdentified = client.uniqueVisitorsMonthly || 0;
        if (!subscription) continue; // is client has no subscription then dont process;

        for (let app of apps) {
          if (app.loginAPIAccessKey) {

            let result = [];

            // const trackingStatus = await this.stealthService.getTrackingStatus(app.loginAPIAccessKey)
            try {
              result = await this.stealthService.getVisitors({ startdate: startDate, enddate: endDate }, app.loginAPIAccessKey);
            } catch (e) {
              console.log('Error while fetching visitors for :', app.loginAPIAccessKey);
            }

            const lastVisit = await this.visitService.findOne({ loginAPIAccessKey: app.loginAPIAccessKey });

            const mappedResult = result.map((res) => ({
              email: res['VisitEmail'],
              visitedAt: !res['VisitAddedDateTime'].includes('Z') ? new Date(res['VisitAddedDateTime'] + 'Z') : new Date(res['VisitAddedDateTime']),
              customerFlag: res['VisitCustomerFlag'],
              pageUrl: res['VisitPageUrl'],
              igIndividualId: res['VisitorIgIndividualId'],
              firstName: res['VisitorFirstName'],
              lastName: res['VisitorLastName'],
              address: res['VisitorAddressLine'],
              city: res['VisitorCity'],
              state: res['VisitorState'],
              zipcode: res['VisitorZipcode'],
              phoneNo: res['VisitorPhone'],
              loginAPIAccessKey: app.loginAPIAccessKey
            }))
              .sort((a, b) => new Date(a.visitedAt) > new Date(b.visitedAt) ? 1 : new Date(a.visitedAt) < new Date(b.visitedAt) ? -1 : 0)
              .filter((res) => !lastVisit || new Date(res.visitedAt) > new Date(lastVisit.visitedAt));

            const existingVisitors = await this.visitorService
              .findAll(
                {
                  loginAPIAccessKey: app.loginAPIAccessKey,
                  email: { $in: mappedResult.map((a) => a.email) }
                },
                {
                  email: 1,
                  autoResponderListDate: 1,
                  autoResponderListName: 1,
                  priority: 1,
                  visitCount: 1,
                });
            const existingCorporates = await this.corporateService
              .findAll(
                {
                  loginAPIAccessKey: app.loginAPIAccessKey,
                  email: { $in: mappedResult.map((a) => a.email) }
                },
                {});
            const bulkWriteArr = [];
            const bulkWriteCorporateArr = [];

            let visitorsObj = {}
            for (let visitor of mappedResult) {
              const key = `${visitor.email}-${visitor.loginAPIAccessKey}`;
              if (!visitorsObj[key]) {
                visitorsObj[key] = {
                  email: visitor['email'],
                  customerFlag: visitor['customerFlag'],
                  firstName: visitor['firstName'],
                  lastName: visitor['lastName'],
                  address: visitor['address'],
                  city: visitor['city'],
                  state: visitor['state'],
                  zipcode: visitor['zipcode'],
                  phoneNo: visitor['phoneNo'],
                  loginAPIAccessKey: visitor.loginAPIAccessKey,
                  igIndividualId: visitor['igIndividualId'],
                  lastVisitedAt: visitor['visitedAt'],
                  dateIdentified: visitor['visitedAt'],
                  visitCount: 1,
                };
              } else {
                visitorsObj[key]['lastVisitedAt'] = visitor['visitedAt'];
                visitorsObj[key]['visitCount']++;
              }
            }
            for (let key in visitorsObj) {
              console.log('key.....', key)

              /**check and add/update corporate data */
              let existingCorporateData: CorporateDocument = existingCorporates.find((ex) => ex.email === visitorsObj[key].email)
              let clonedCorporateData = { ...(!!existingCorporateData ? existingCorporateData.toObject() : {}), ...visitorsObj[key] };

              let corporate_data = await this.getCorporateData(visitorsObj[key].email, app.loginAPIAccessKey)
              if (corporate_data) {
                clonedCorporateData = { ...clonedCorporateData, ...corporate_data };

                if (existingCorporateData) {

                  bulkWriteCorporateArr.push({
                    updateOne: {
                      filter: {
                        loginAPIAccessKey: app.loginAPIAccessKey,
                        email: clonedCorporateData.email
                      },
                      update: {
                        $set: clonedCorporateData
                      }
                    }
                  })
                } else {
                  bulkWriteCorporateArr.push({
                    insertOne: {
                      document: clonedCorporateData
                    }
                  })
                }
              }
              /**end add/update corporate data */


              let existingVisitor: VisitorDocument = existingVisitors.find((ex) => ex.email === visitorsObj[key].email)
              let clonedVisitor = { ...(!!existingVisitor ? existingVisitor.toObject() : {}), ...visitorsObj[key] };

              if (existingVisitor) {
                delete clonedVisitor['dateIdentified'];
                clonedVisitor['visitCount'] = existingVisitor.visitCount + visitorsObj[key].visitCount;
                let visitorPriority = clonedVisitor['priority'];

                if(client.isLeadProritySet)
                  this.getCustomLeadPriority(clonedVisitor['visitCount'], subscription.isHotPriorityAllowed, client._id);
                else
                  visitorPriority = TasksService.getLeadPriority(clonedVisitor['visitCount'], subscription.isHotPriorityAllowed);

                if (visitorPriority !== clonedVisitor['priority']) {
                  clonedVisitor['priority'] = visitorPriority;

                  if (
                    clonedVisitor['email'] &&
                    (
                      !clonedVisitor['autoResponderListDate'] ||
                      (
                        clonedVisitor['autoResponderListDate'].setDate(clonedVisitor['autoResponderListDate'].getDate() + DAYS_TO_CHANGE_RESPONDER_LIST) < new Date().getTime() &&
                        !!clonedVisitor['autoResponderListName'] &&
                        `${clonedVisitor['autoResponderListName'][0]}${clonedVisitor['autoResponderListName'][1]}` !== `${clonedVisitor['priority'][0]}_`
                      )
                    )
                  ) {
                    if (campaignIds.some(item => activeCampaignIds.includes(item)))
                      clonedVisitor = { ...clonedVisitor, ...await this.syncContact(clonedVisitor, campaignTypes) }
                  }
                }

                bulkWriteArr.push({
                  updateOne: {
                    filter: {
                      loginAPIAccessKey: app.loginAPIAccessKey,
                      email: clonedVisitor.email
                    },
                    update: {
                      $set: clonedVisitor
                    }
                  }
                })

              } else {
                if (visitorsIdentified > subscription.uniqueVisitorsMonthlyLimit && updatedClient['status'] !== 'paused') {
                  Logger.log('Subscription Limit Reached!')
                  /* If multiple apps are added to client in future then limits and blocking of apps must be revised, 
                    currently limit is based on client and not on every app and we are blocking tracking 
                    on all apps if limit is reached the same is reset at the start of every month */
                  for (let appToBlock of client.apps) {
                    if (appToBlock.loginAPIAccessKey) {
                      try {
                        await this.stealthService.toggleTracking(0, appToBlock.loginAPIAccessKey);
                      } catch (e) {
                        console.log('Error while disabling tracking for', appToBlock.loginAPIAccessKey);
                      }
                    }
                  }
                  updatedClient['status'] = 'paused';
                  continue;
                }


                clonedVisitor['dateIdentified'] = clonedVisitor['dateIdentified'];
                clonedVisitor['visitCount'] = visitorsObj[key].visitCount;
                if(client.isLeadProritySet)
                  clonedVisitor['priority'] = await this.getCustomLeadPriority(clonedVisitor['visitCount'], subscription.isHotPriorityAllowed, client._id);
                else
                  clonedVisitor['priority'] = TasksService.getLeadPriority(clonedVisitor['visitCount'], subscription.isHotPriorityAllowed);

                if (
                  clonedVisitor['email']
                ) {
                  if (campaignIds.some(item => activeCampaignIds.includes(item)))
                    clonedVisitor = { ...clonedVisitor, ...await this.syncContact(clonedVisitor, campaignTypes) }
                }

                bulkWriteArr.push({
                  insertOne: {
                    document: clonedVisitor
                  }
                })

                visitorsIdentified++;
              }
            }
            await this.visitorService.bulkWrite(bulkWriteArr);
            await this.corporateService.bulkWrite(bulkWriteCorporateArr);
            await this.visitService.bulkInsert(mappedResult.map((res) => ({
              visitedAt: (res['visitedAt']),
              pageUrl: res['pageUrl'],
              igIndividualId: res['igIndividualId'],
              email: res['email'],
              loginAPIAccessKey: res['loginAPIAccessKey']
            })));

          }
        }
        const percentageOfVisitorsIdentified = (visitorsIdentified / subscription.uniqueVisitorsMonthlyLimit) * 100;
        if (percentageOfVisitorsIdentified > 50 && client.monthlyVisitorIdentificationAlertCount < 1) {
          this.emailService.mail({
            to: client.email,
            subject: 'Usage Alert',
            text: 'You have consumed 50% of your monthly usage.'
          })
          updatedClient['monthlyVisitorIdentificationAlertCount'] = ++client.monthlyVisitorIdentificationAlertCount;
        } else if (percentageOfVisitorsIdentified > 90 && client.monthlyVisitorIdentificationAlertCount < 2) {
          this.emailService.mail({
            to: client.email,
            subject: 'Usage Alert',
            text: 'You have consumed 90% of your monthly usage.'
          })
          updatedClient['monthlyVisitorIdentificationAlertCount'] = ++client.monthlyVisitorIdentificationAlertCount;
        }
        if (client.uniqueVisitorsMonthly !== visitorsIdentified) updatedClient['uniqueVisitorsMonthly'] = visitorsIdentified;
        !!Object.keys(updatedClient).length && await this.clientService.findOneAndUpdate({ _id: client._id }, updatedClient);
      } catch (err) {
        console.log('Unknown Exception', err);
      }

    }
  }

  @Cron('0 0 1 * *')
  async resetLimits() {

    // const clients = await this.clientService.findAll({ status: 'live' });
    // for ( let client of clients ) {}
    // await this.clientService.updateMany({}, { uniqueVisitorsMonthly: 0, monthlyVisitorIdentificationAlertCount: 0 });

    // const blockClients = await this.clientService.findAll({ status: 'paused' });
    // const unblockedClientIds = [];

    // for(let client of blockClients) {
    //   let appsUnblockedCount;
    //   for ( let app of client.apps) {
    //     if (app.loginAPIAccessKey) {
    //       try {
    //         await this.stealthService.toggleTracking( 1, app.loginAPIAccessKey);
    //         appsUnblockedCount++;
    //       } catch (e) {
    //         console.log('Error while unblocking client', e);
    //       }
    //     }
    //   }
    //   appsUnblockedCount === client.apps.length && unblockedClientIds.push(client._id);
    // }
    // await this.clientService.updateMany({ _id: { $in : unblockedClientIds }}, { status: 'live' });
  }

  processFile({ stream, fileName, clientMap, destDir }, onDownload) {
    const campaignStatsWrite = [];
    const unsubscribedUserWrite = [];
    stream.pipe(fs.createWriteStream(`${destDir}/${fileName}`))
    stream.once('close', () => {
      console.log('Downloaded', `${destDir}/${fileName}`)
      const reportData = xlsx.readFile(`${destDir}/${fileName}`, { cellDates: true });
      let jsonStream = xlsx.stream.to_json(reportData['Sheets']['Sheet1'], { raw: true });

      if (fileName.includes('message_stats_daily')) {
        jsonStream.on('data', (row) => {
          let clientId = clientMap.get(row.campaign_name.substring(2));

          if (!!clientId) {
            campaignStatsWrite.push({
              insertOne: {
                document: {
                  messageId: row.message_id,
                  campaignId: row.campaign_id,
                  uniqueOpenRate: row.unique_open_rate,
                  clickRate: row.click_rate,
                  linksClicked: row.unique_links_clicked,
                  uniqueClickRate: row.unique_click_rate,
                  totalEmailsSent: row.total_emails_sent,
                  emailsSent: row.emails_sent,
                  emailsDelivered: row.emails_delivered,
                  emailsOpened: row.unique_opens,
                  campaignName: row.campaign_name,
                  unsubscribeRate: row.unsubscribe_rate,
                  unsubscribed: row.unsubscribed,
                  clientId,
                  fileName
                }
              }
            })
          }
        })
        jsonStream.on('end', () => {
          console.log('campaignStatsWrite', campaignStatsWrite.length);

          campaignStatsWrite && campaignStatsWrite.length &&
            this.campaignStatService.bulkWrite(campaignStatsWrite)

        });
      } else if (fileName.includes('removed_contacts_daily')) {
        jsonStream.on('data', (row) => {
          let clientId = clientMap.get(row.list_name.substring(2));
          if (!!clientId && row.delete_time) {
            unsubscribedUserWrite.push({
              insertOne: {
                document: {
                  deletedAt: row.delete_time,
                  email: row.email,
                  campaignName: row.list_name,
                  clientId,
                  fileName
                }
              }
            })
          }
        });

        jsonStream.on('end', () => {
          console.log('unsubscribedUserWrite', unsubscribedUserWrite.length);

          unsubscribedUserWrite && unsubscribedUserWrite.length &&
            this.unsubscribedUserService.bulkWrite(unsubscribedUserWrite)
        });
      }
      onDownload({ fileName });
    })
  }

  @Cron('0 8 * * *')
  async processReports() {
    // this will run everyday by 8:00 AM
    try {
      const clients = await this.clientService.findAll();
      const clientMap = new Map();
      for (let client of clients) clientMap.set(client.companyName.replace(/ /g, '').toLowerCase(), client._id);
      const destDir = `${process.cwd()}/../../dest`;
      const client = new Client();
      client.on('ready', () => {
        client.list('reports/', async (err, list) => {
          if (err) {
            console.log(err)
          } else {
            const date = new Date();
            const dateString = (date.getUTCFullYear() + ("0" + (date.getUTCMonth() + 1)).slice(-2) + ("0" + (date.getUTCDate() - 1)).slice(-2));

            //console.log('dateString',dateString)
            const filteredFiles = list.filter((file) => file.name.includes(`message_stats_daily_${dateString}`) || file.name.includes(`removed_contacts_daily_${dateString}`));
            let downloadedFilesCount = 0, existingFilesCount = 0;
            if (!filteredFiles.length) {
              console.log('No file available to download');
              client.end();
            } else {
              for (let file of filteredFiles) {
                const fileName = file.name;
                const existingFileQuery = fileName.includes(`message_stats_daily_${dateString}`)
                  ? this.campaignStatService.findAll({ fileName })
                  : fileName.includes(`removed_contacts_daily_${dateString}`)
                    ? this.unsubscribedUserService.findAll({ fileName }) : null;
                const existingFile = await existingFileQuery;
                if (existingFile && !existingFile.length) {
                  console.log('Downloading File');
                  client.get(
                    `reports/${fileName}`,
                    (err, stream) => {
                      if (err) {
                        console.log('Error While Downloading File', fileName)
                      } else {
                        this.processFile({
                          stream,
                          fileName,
                          destDir,
                          clientMap
                        }, ({ fileName }) => {
                          downloadedFilesCount++;
                          console.log('downloadedFilesCount', downloadedFilesCount);
                          console.log('existingFilesCount', existingFilesCount);
                          console.log('totalFilesCount', downloadedFilesCount + existingFilesCount);
                          existingFilesCount + downloadedFilesCount === filteredFiles.length && client.end();
                        })
                      }
                    });
                } else {
                  console.log('File Already Exists');
                  existingFilesCount++;
                  console.log('downloadedFilesCount', downloadedFilesCount);
                  console.log('existingFilesCount', existingFilesCount);
                  console.log('totalFilesCount', downloadedFilesCount + existingFilesCount);
                  existingFilesCount + downloadedFilesCount === filteredFiles.length && client.end();
                }
              }
            }

          }
        });
      });



      client.connect({
        host: process.env.FTP_URL,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
      });
      client.on('greeting', console.log);
      client.on('error', (err) => console.log(err));
      client.on('end', () => console.log('Connection Ended!'));
    } catch (e) {
      console.log(e);
    }
  }

  // @Cron('0 1 * * *')
  @Cron('* * * * * *')
  async recurringBilling() {

    const clients = await this.clientService.findAll();
    const curDate = new Date();
    for ( let client of clients ) {
      if (client.lastBillingDate) {
        const lastBillingDate = new Date(client.lastBillingDate);
        lastBillingDate.setMonth(lastBillingDate.getMonth() + 1);

        if (lastBillingDate.getMonth() === curDate.getMonth() && lastBillingDate.getDate() === curDate.getDate()){
          console.log("start");
          const subscription = await this.subscriptionService.findOne({ _id: client.subscriptionId });
          var additionalPrice = 0;
          if (client.isAdditionalFee && (client.uniqueVisitorsMonthly - subscription.uniqueVisitorsMonthlyLimit) > 0) {
            additionalPrice = subscription.additionalFee * (client.uniqueVisitorsMonthly - subscription.uniqueVisitorsMonthlyLimit);
          }
          var items = [{
            id: subscription.id,
            name : subscription.name,
            description : "",
            quantity : 1,
            unitPrice : subscription.price
          }];

          if (additionalPrice != 0) {
            items.push({
              id: subscription.id,
              name : subscription.name,
              description : "Additinal Fee",
              quantity : 1,
              unitPrice : additionalPrice
            })
          }

          var paymentResult = await this.paymentService.MakePayment(client, items, subscription.price + additionalPrice); 
    
          if (paymentResult['result'] == false)
          {
            console.log("failed");            
            await this.clientService.findOneAndUpdate({ _id: client.id }, { status: 'paused' });
            continue;
          }
          else
          {
            console.log("success");
          }
          
          const invoice = {
            billedTo: `${client.firstName}${ client.lastName ? ' ' + client.lastName : ''}`,
            billingAddress: client.address,
            paymentMethod: 'credit',
            tax: 0,
            amount: subscription.price + additionalPrice,
            total: subscription.price + additionalPrice,
            itemName: subscription.name,
            email: client.email,
          }
          
          const raisedInvoice = await this.invoiceService.create(invoice);
    
          this.emailService.mail({
            to: client.email,
            from: process.env.SMTP_USERNAME,
            subject: "Payment Receipt",
            html: `
              Hello,<br /><br />
              You have successfully paid $${subscription.price} and purchased ${subscription.name} subscription on Stealth Data.
              <br />
              You will be charged $${subscription.price} on an monthly basis.
              <br /><br />
              Stealth Data.
            `
          })

          await this.clientService.findOneAndUpdate({ _id: client.id }, { lastBillingDate: curDate, uniqueVisitorsMonthly: 0, monthlyVisitorIdentificationAlertCount: 0 });
        }
      } else {
        await this.clientService.findOneAndUpdate({ _id: client.id }, { lastBillingDate: curDate });
      }
      return;
    }
  }
  async getCorporateData(email = '', loginAPIAccessKey = '') {
    const peoplesDetails: any = await this.peoplesDataService.getData({ 'email': email });
    let clonedCorporateData = {}
    if (peoplesDetails && peoplesDetails.status == 200) {
      if (peoplesDetails.likelihood >= 6) {
        clonedCorporateData['corporateId'] = peoplesDetails.data.id;
        clonedCorporateData['likeliHood'] = peoplesDetails.likelihood;
        clonedCorporateData['email'] = email;
        clonedCorporateData['loginAPIAccessKey'] = loginAPIAccessKey;
        clonedCorporateData['fullName'] = peoplesDetails.data.full_name;
        clonedCorporateData['gender'] = peoplesDetails.data.gender;
        clonedCorporateData['birthYear'] = peoplesDetails.data.birth_year;
        clonedCorporateData['birthDate'] = peoplesDetails.data.birth_date;
        clonedCorporateData['linkedInURL'] = peoplesDetails.data.linkedin_url;
        clonedCorporateData['linkedInUsername'] = peoplesDetails.data.linkedin_username;
        clonedCorporateData['facebookURL'] = peoplesDetails.data.facebook_url;
        clonedCorporateData['facebookUsername'] = peoplesDetails.data.facebook_username;
        clonedCorporateData['twitterURL'] = peoplesDetails.data.twitter_url;
        clonedCorporateData['twitterUsername'] = peoplesDetails.data.twitter_username;
        clonedCorporateData['githubURL'] = peoplesDetails.data.github_url;
        clonedCorporateData['githubUsername'] = peoplesDetails.data.github_username;
        clonedCorporateData['workMail'] = peoplesDetails.data.work_email;
        clonedCorporateData['jobTitle'] = peoplesDetails.data.job_title;
        clonedCorporateData['jobTitleRole'] = peoplesDetails.data.job_title_role;
        clonedCorporateData['jobCompanyId'] = peoplesDetails.data.job_company_id;
        clonedCorporateData['jobCompanyName'] = peoplesDetails.data.job_company_name;
        clonedCorporateData['jobCompanyWebsite'] = peoplesDetails.data.job_company_website;
        clonedCorporateData['jobCompanySize'] = peoplesDetails.data.job_company_size;
        clonedCorporateData['jobCompanyIndustry'] = peoplesDetails.data.job_company_industry;
        clonedCorporateData['jobCompanyLocationMetro'] = peoplesDetails.data.job_company_location_metro;
        clonedCorporateData['jobCompanyFacebookURL'] = peoplesDetails.data.job_company_facebook_url;
        clonedCorporateData['jobCompanyLinkedInURL'] = peoplesDetails.data.job_company_linkedin_url;

        return clonedCorporateData;
      } else {
        return false;
      }

    } else {
      return false;
    }
  }

  async testPeoplesData(params: any) {
    const peoplesDetails:any = await this.peoplesDataService.getData(params);
    console.log('peoplesDetails', peoplesDetails);

  }

}