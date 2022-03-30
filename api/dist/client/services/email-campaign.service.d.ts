import { Model } from 'mongoose';
import { EmailCampaignDocument } from '../schemas/email-campaign.schema';
import { CreateEmailCampaignDto, EmailCampaignSearchParamsDto, UpdateEmailCampaignDto } from '../dto/email-campaign.dto';
export declare class EmailCampaignService {
    private emailCampaignModel;
    constructor(emailCampaignModel: Model<EmailCampaignDocument>);
    create(createEmailCampaignDto: CreateEmailCampaignDto): Promise<EmailCampaignDocument>;
    findOneAndUpdate(params: EmailCampaignSearchParamsDto, updateEmailCampaignDto: UpdateEmailCampaignDto): Promise<EmailCampaignDocument>;
    delete(_id: string): Promise<EmailCampaignDocument>;
    findOne(params: EmailCampaignSearchParamsDto): Promise<EmailCampaignDocument>;
    findAll(params?: EmailCampaignSearchParamsDto): Promise<EmailCampaignDocument[]>;
}
