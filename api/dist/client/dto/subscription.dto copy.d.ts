import { ObjectId } from 'mongoose';
export declare class CreateSubscriptionDto {
    name: string;
    uniqueVisitorsMonthlyLimit?: number;
    isHotPriorityAllowed?: boolean;
    isDashboardAllowed?: boolean;
    isEmailCampaignsAllowed?: boolean;
    isCrmMatchingAllowed?: boolean;
    price?: number;
    annualDiscount?: number;
    isActive?: boolean;
    html?: string;
    listOrder?: number;
    additionalFee?: number;
    isCustomPackage?: boolean;
}
export declare class UpdateSubscriptionDto {
    name?: string;
    uniqueVisitorsMonthlyLimit?: number;
    isHotPriorityAllowed?: boolean;
    isEmailCampaignsAllowed?: boolean;
    isDashboardAllowed?: boolean;
    isCrmMatchingAllowed?: boolean;
    price?: number;
    annualDiscount?: number;
    isActive?: boolean;
    html?: string;
    listOrder?: number;
    additionalFee?: number;
    isCustomPackage?: boolean;
}
export declare class SubscriptionSearchParamsDto {
    _id?: string | ObjectId;
    name?: string;
    isDeleted?: boolean;
    isActive?: boolean;
}
