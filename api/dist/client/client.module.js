"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_module_1 = require("../common/common.module");
const client_controller_1 = require("./controllers/client.controller");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
const email_campaign_controller_1 = require("./controllers/email-campaign.controller");
const payment_controller_1 = require("./controllers/payment.controller");
const subscription_controller_1 = require("./controllers/subscription.controller");
const visit_controller_1 = require("./controllers/visit.controller");
const visitor_controller_1 = require("./controllers/visitor.controller");
const setting_controller_1 = require("./controllers/setting.controller");
const campaign_stat_schema_1 = require("./schemas/campaign-stat.schema");
const client_schema_1 = require("./schemas/client.schema");
const email_campaign_schema_1 = require("./schemas/email-campaign.schema");
const invoice_schema_1 = require("./schemas/invoice.schema");
const subscription_schema_1 = require("./schemas/subscription.schema");
const unsubscribed_user_schema_1 = require("./schemas/unsubscribed-user.schema");
const visit_schema_1 = require("./schemas/visit.schema");
const visitor_schema_1 = require("./schemas/visitor.schema");
const corporate_schema_1 = require("./schemas/corporate.schema");
const leadpriority_schema_1 = require("./schemas/leadpriority.schema");
const crmmatchinghistory_schema_1 = require("./schemas/crmmatchinghistory.schema");
const campaign_stat_service_1 = require("./services/campaign-stat.service");
const client_service_1 = require("./services/client.service");
const email_campaign_service_1 = require("./services/email-campaign.service");
const invoice_service_1 = require("./services/invoice.service");
const subscription_service_1 = require("./services/subscription.service");
const tasks_service_1 = require("./services/tasks.service");
const unsubscribed_user_service_1 = require("./services/unsubscribed-user.service");
const visit_service_1 = require("./services/visit.service");
const visitor_service_1 = require("./services/visitor.service");
const crmmatchinghistory_service_1 = require("./services/crmmatchinghistory.service");
const corporate_service_1 = require("./services/corporate.service");
const leadpriority_service_1 = require("./services/leadpriority.service");
const urltrackingconfig_schema_1 = require("./schemas/urltrackingconfig.schema");
const urltrackingconfig_service_1 = require("./services/urltrackingconfig.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("../auth/constants");
let ClientModule = class ClientModule {
};
ClientModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: client_schema_1.Client.name, schema: client_schema_1.ClientSchema },
                { name: visitor_schema_1.Visitor.name, schema: visitor_schema_1.VisitorSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: visit_schema_1.Visit.name, schema: visit_schema_1.VisitSchema },
                { name: email_campaign_schema_1.EmailCampaign.name, schema: email_campaign_schema_1.EmailCampaignSchema },
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
                { name: campaign_stat_schema_1.CampaignStat.name, schema: campaign_stat_schema_1.CampaignStatSchema },
                { name: unsubscribed_user_schema_1.UnsubscribedUser.name, schema: unsubscribed_user_schema_1.UnsubscribedUserSchema },
                { name: crmmatchinghistory_schema_1.CrmMatchingHistory.name, schema: crmmatchinghistory_schema_1.CrmMatchingHistorySchema },
                { name: corporate_schema_1.CorporateData.name, schema: corporate_schema_1.CorporateSchema },
                { name: urltrackingconfig_schema_1.UrlTrackingConfig.name, schema: urltrackingconfig_schema_1.UrlTrackingConfigSchema },
                { name: leadpriority_schema_1.LeadPriorityData.name, schema: leadpriority_schema_1.LeadPrioritySchema },
            ]),
            jwt_1.JwtModule.register({
                secret: constants_1.default.secret,
                signOptions: { expiresIn: '1 days' },
            }),
            common_module_1.CommonModule
        ],
        controllers: [client_controller_1.ClientController, visitor_controller_1.VisitorController, setting_controller_1.SettingController, subscription_controller_1.SubscriptionController, dashboard_controller_1.DashboardController, visit_controller_1.VisitController, email_campaign_controller_1.EmailCampaignController, payment_controller_1.PaymentController],
        providers: [client_service_1.ClientService, visitor_service_1.VisitorService, urltrackingconfig_service_1.UrlTrackingConfigService, subscription_service_1.SubscriptionService, tasks_service_1.TasksService, visit_service_1.VisitService, email_campaign_service_1.EmailCampaignService, invoice_service_1.InvoiceService, campaign_stat_service_1.CampaignStatService, unsubscribed_user_service_1.UnsubscribedUserService, crmmatchinghistory_service_1.CrmMatchingHistoryService, corporate_service_1.CorporateService, leadpriority_service_1.LeadPriorityService],
        exports: [client_service_1.ClientService]
    })
], ClientModule);
exports.ClientModule = ClientModule;
//# sourceMappingURL=client.module.js.map