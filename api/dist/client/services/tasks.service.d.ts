import { StealthService } from 'src/common/services/stealth.service';
import { ClientService } from './client.service';
import { VisitorService } from './visitor.service';
import { VisitService } from './visit.service';
import { CorporateService } from './corporate.service';
import { SubscriptionService } from './subscription.service';
import { EmailCampaignService } from "./email-campaign.service";
import { GetResponseService } from 'src/common/services/get-response.service';
import { PeoplesDataService } from 'src/common/services/peoplesdata-service';
import { EmailService } from 'src/common/services/email.service';
import { CampaignStatService } from './campaign-stat.service';
import { UnsubscribedUserService } from './unsubscribed-user.service';
import { PaymentService } from 'src/common/services/payment.service';
import { InvoiceService } from './invoice.service';
import { LeadPriorityService } from './leadpriority.service';
export declare class TasksService {
    private clientService;
    private visitService;
    private visitorService;
    private stealthService;
    private subscriptionService;
    private emailCampaignService;
    private getResponseService;
    private corporateService;
    private peoplesDataService;
    private emailService;
    private campaignStatService;
    private unsubscribedUserService;
    private paymentService;
    private invoiceService;
    private leadPriorityService;
    private readonly logger;
    constructor(clientService: ClientService, visitService: VisitService, visitorService: VisitorService, stealthService: StealthService, subscriptionService: SubscriptionService, emailCampaignService: EmailCampaignService, getResponseService: GetResponseService, corporateService: CorporateService, peoplesDataService: PeoplesDataService, emailService: EmailService, campaignStatService: CampaignStatService, unsubscribedUserService: UnsubscribedUserService, paymentService: PaymentService, invoiceService: InvoiceService, leadPriorityService: LeadPriorityService);
    static getLeadPriority: (visitCount: any, isHotPriorityAllowed: any) => string;
    getCustomLeadPriority(visitCount: any, isHotPriorityAllowed: any, clientId: any): Promise<string>;
    syncContact(visitor: any, campaignTypes: any): Promise<{
        autoResponderListName?: undefined;
        autoResponderListDate?: undefined;
    } | {
        autoResponderListName: any;
        autoResponderListDate: Date;
    }>;
    handleCron(params?: any): Promise<void>;
    resetLimits(): Promise<void>;
    processFile({ stream, fileName, clientMap, destDir }: {
        stream: any;
        fileName: any;
        clientMap: any;
        destDir: any;
    }, onDownload: any): void;
    processReports(): Promise<void>;
    recurringBilling(): Promise<void>;
    getCorporateData(email?: string, loginAPIAccessKey?: string): Promise<{}>;
    testPeoplesData(params: any): Promise<void>;
}
