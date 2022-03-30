/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type CrmMatchingHistoryDocument = CrmMatchingHistory & Document;
export declare class CrmMatchingHistory {
    crmMatched: string;
    fileName: string;
    totalRecords: number;
    uploadDate: Date;
    filePath: string;
    isDeleted: Boolean;
    uID: string;
}
export declare const CrmMatchingHistorySchema: import("mongoose").Schema<any>;
