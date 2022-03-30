/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type ClientDocument = Client & Document;
export declare class App {
    url: string;
    req?: any;
    loginGUID?: string;
    loginAPIAccessKey?: string;
}
export declare class CardInfo {
    name: string;
    cardnumber: string;
    cvv: string;
    expiredate: string;
}
export declare class Address {
    line1: string;
    line2?: string;
    city?: string;
    zipcode?: string;
    state?: string;
    country?: string;
}
export declare class Client {
    firstName: string;
    lastName: string;
    password: string;
    username: string;
    email: string;
    description: string;
    subscriptionId: string;
    contactNo: string;
    companyName: string;
    avatar: string;
    fromFields: string[];
    apps: App[];
    customerGUID: string;
    address: Address;
    monthlyVisitorIdentificationAlertCount: number;
    status: string;
    createdAt: Date;
    isActive: Boolean;
    uniqueVisitorsMonthly: number;
    isDeleted: Boolean;
    cardInfo: CardInfo;
    isAdditionalFee: boolean;
    customerProfileId: string;
    customerPaymentProfileId: string;
    lastBillingDate: Date;
    isLeadProritySet: Boolean;
}
export declare const ClientSchema: import("mongoose").Schema<any>;
