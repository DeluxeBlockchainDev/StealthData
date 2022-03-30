import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '../common/common.module';
import { ClientController } from './controllers/client.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { EmailCampaignController } from './controllers/email-campaign.controller';
import { PaymentController } from './controllers/payment.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { VisitController } from './controllers/visit.controller';
import { VisitorController } from './controllers/visitor.controller';
import { SettingController } from './controllers/setting.controller';
import { CampaignStat, CampaignStatSchema } from './schemas/campaign-stat.schema';
import { Client, ClientSchema } from './schemas/client.schema';
import { EmailCampaign, EmailCampaignSchema } from './schemas/email-campaign.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { SubscriptionSchema, Subscription } from './schemas/subscription.schema';
import { UnsubscribedUser, UnsubscribedUserSchema } from './schemas/unsubscribed-user.schema';
import { VisitSchema, Visit } from './schemas/visit.schema';
import { Visitor, VisitorSchema } from './schemas/visitor.schema';
import { CorporateData, CorporateSchema } from './schemas/corporate.schema';
import { LeadPriorityData, LeadPrioritySchema } from './schemas/leadpriority.schema';
import { CrmMatchingHistory, CrmMatchingHistorySchema } from './schemas/crmmatchinghistory.schema';
import { CampaignStatService } from './services/campaign-stat.service';
import { ClientService } from './services/client.service';
import { EmailCampaignService } from './services/email-campaign.service';
import { InvoiceService } from './services/invoice.service';
import { SubscriptionService } from './services/subscription.service';
import { TasksService } from './services/tasks.service';
import { UnsubscribedUserService } from './services/unsubscribed-user.service';
import { VisitService } from './services/visit.service';
import { VisitorService } from './services/visitor.service';
import { CrmMatchingHistoryService } from './services/crmmatchinghistory.service';
import { CorporateService } from './services/corporate.service';
import { LeadPriorityService } from './services/leadpriority.service';
import { UrlTrackingConfig, UrlTrackingConfigSchema } from './schemas/urltrackingconfig.schema';
import { UrlTrackingConfigService } from './services/urltrackingconfig.service';
import { JwtModule } from '@nestjs/jwt';
import constants from '../auth/constants';
@Module({
	imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Visitor.name, schema: VisitorSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Visit.name, schema: VisitSchema },
      { name: EmailCampaign.name, schema: EmailCampaignSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: CampaignStat.name, schema: CampaignStatSchema },
      { name: UnsubscribedUser.name, schema: UnsubscribedUserSchema },
      { name: CrmMatchingHistory.name, schema: CrmMatchingHistorySchema },
      { name: CorporateData.name, schema: CorporateSchema },
      { name: UrlTrackingConfig.name, schema: UrlTrackingConfigSchema },
      { name: LeadPriorityData.name, schema: LeadPrioritySchema},
    ]),
    JwtModule.register({
      secret: constants.secret,
      signOptions: { expiresIn: '1 days' },
    }),
    CommonModule
	],
  controllers: [ClientController, VisitorController, SettingController, SubscriptionController, DashboardController, VisitController, EmailCampaignController, PaymentController],
  providers: [ClientService, VisitorService, UrlTrackingConfigService, SubscriptionService, TasksService, VisitService, EmailCampaignService, InvoiceService, CampaignStatService, UnsubscribedUserService, CrmMatchingHistoryService, CorporateService, LeadPriorityService],
  exports: [ClientService]
})
export class ClientModule {}
