/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type UnsubscribedUserDocument = UnsubscribedUser & Document;
export declare class UnsubscribedUser {
    campaignName: string;
    clientId: string;
    email: string;
    deletedAt: Date;
    fileName: string;
    createdAt: Date;
}
export declare const UnsubscribedUserSchema: import("mongoose").Schema<any>;
