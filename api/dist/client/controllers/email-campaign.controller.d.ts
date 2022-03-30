import { EmailCampaignService } from '../services/email-campaign.service';
import { CreateEmailCampaignDto, UpdateEmailCampaignDto } from '../dto/email-campaign.dto';
import { GetResponseService } from 'src/common/services/get-response.service';
import { ClientService } from '../services/client.service';
export declare class EmailCampaignController {
    private emailCampaignService;
    private clientService;
    private getResponseService;
    constructor(emailCampaignService: EmailCampaignService, clientService: ClientService, getResponseService: GetResponseService);
    create(createDto: CreateEmailCampaignDto, req: any): Promise<import("../schemas/email-campaign.schema").EmailCampaignDocument>;
    findAll(req: any): Promise<import("../schemas/email-campaign.schema").EmailCampaignDocument[]>;
    getCampaignTypes(req: any): Promise<any>;
    getFromFields(req: any): Promise<any>;
    addFromFields(req: any, body: any): Promise<{
        success: number;
        message: string;
    }>;
    update(_id: string, updateDto: UpdateEmailCampaignDto): Promise<import("../schemas/email-campaign.schema").EmailCampaignDocument>;
    read(_id: string): Promise<import("../schemas/email-campaign.schema").EmailCampaignDocument>;
}
