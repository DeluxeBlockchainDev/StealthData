export declare class CreateEmailCampaignDto {
    name: string;
    html?: string;
    autoResponderId?: string;
    fromField?: string;
    replyTo?: string;
    subject?: string;
    campaignTypeId?: string;
    editorDesign?: any;
    clientId?: string;
}
export declare class UpdateEmailCampaignDto {
    name?: string;
    html?: string;
    autoResponderId?: string;
    fromField?: string;
    replyTo?: string;
    subject?: string;
    campaignTypeId?: string;
    editorDesign?: any;
    isActive?: boolean;
}
export declare class EmailCampaignSearchParamsDto {
    _id?: any;
    clientId?: any;
    name?: string;
    campaignTypeId?: any;
    isDeleted?: boolean;
    isActive?: boolean;
}
