/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type SubscriptionDocument = Subscription & Document;
export declare class Subscription {
    name: string;
    html: string;
    uniqueVisitorsMonthlyLimit: number;
    isHotPriorityAllowed: boolean;
    isDashboardAllowed: boolean;
    isCrmMatchingAllowed: boolean;
    isEmailCampaignsAllowed: boolean;
    isVisits: boolean;
    isUrlsViewed: boolean;
    isLeadPriority: boolean;
    isCrmMatched: boolean;
    isDashboardCrmMatched: boolean;
    isMonthlyLeadPriority: boolean;
    isMonthlyEmailStats: boolean;
    isTop5Urls: boolean;
    isTopVisitors: boolean;
    isAccessToCorporate: boolean;
    isAdvancedXLSXExport: boolean;
    customUrlTracking: boolean;
    customLeadPriority: boolean;
    price: number;
    annualDiscount: number;
    createdAt: Date;
    isActive: Boolean;
    isDeleted: Boolean;
    listOrder: number;
    additionalFee: number;
    isCustomPackage: boolean;
}
export declare const SubscriptionSchema: import("mongoose").Schema<any>;
