/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type EmailCampaignDocument = EmailCampaign & Document;
export declare class EmailCampaign {
    name: string;
    clientId: string;
    html: string;
    editorDesign: any;
    fromField: string;
    replyTo: string;
    subject: string;
    autoResponderId: string;
    campaignTypeId: string;
    createdAt: Date;
    isActive: Boolean;
    isDeleted: Boolean;
}
export declare const EmailCampaignSchema: import("mongoose").Schema<any>;
