/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type UrlTrackingConfigDocument = UrlTrackingConfig & Document;
export declare class UrlTrackingConfig {
    url: string;
    createdAt: Date;
    status: Boolean;
    uId: string;
}
export declare const UrlTrackingConfigSchema: import("mongoose").Schema<any>;
