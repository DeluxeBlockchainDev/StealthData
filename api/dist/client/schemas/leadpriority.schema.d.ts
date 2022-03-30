/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type LeadPriorityDocument = LeadPriorityData & Document;
export declare class LeadPriorityData {
    clientId: string;
    loginAPIAccessKey?: string;
    mild: number;
    warm: number;
    hot: number;
    createdAt?: Date;
}
export declare const LeadPrioritySchema: import("mongoose").Schema<any>;
