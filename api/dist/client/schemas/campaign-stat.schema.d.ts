/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type CampaignStatDocument = CampaignStat & Document;
export declare class CampaignStat {
    campaignName: string;
    campaignId: string;
    messageId: string;
    uniqueOpenRate: number;
    clickRate: number;
    linksClicked: number;
    uniqueClickRate: number;
    unsubscribeRate: number;
    totalUnsubscribed: number;
    emailsSent: number;
    emailsDelivered: number;
    emailsOpened: number;
    totalEmailsSent: number;
    clientId: string;
    fileName: string;
    createdAt: Date;
}
export declare const CampaignStatSchema: import("mongoose").Schema<any>;
