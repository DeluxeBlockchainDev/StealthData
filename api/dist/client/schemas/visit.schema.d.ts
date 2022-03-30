/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type VisitDocument = Visit & Document;
export declare class Visit {
    loginAPIAccessKey?: string;
    visitedAt: Date;
    pageUrl: string;
    igIndividualId: string;
    email: string;
    createdAt?: Date;
    isDeleted?: Boolean;
}
export declare const VisitSchema: import("mongoose").Schema<any>;
