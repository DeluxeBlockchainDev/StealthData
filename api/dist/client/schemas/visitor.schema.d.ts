/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type VisitorDocument = Visitor & Document;
export declare class Visitor {
    email: string;
    loginAPIAccessKey?: string;
    lastVisitedAt: Date;
    customerFlag: string;
    igIndividualId: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    phoneNo: string;
    priority: string;
    autoResponderListName: string;
    autoResponderListDate: Date;
    visitCount: number;
    crmMatchDate?: Date;
    crmMatchId?: string;
    dateIdentified?: Date;
    createdAt?: Date;
    isDeleted?: Boolean;
}
export declare const VisitorSchema: import("mongoose").Schema<any>;
