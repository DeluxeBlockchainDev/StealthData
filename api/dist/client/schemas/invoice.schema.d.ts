/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
import { Address } from './client.schema';
export declare type InvoiceDocument = Invoice & Document;
export declare class Invoice {
    clientId: string;
    billingAddress?: Address;
    billedTo?: string;
    paymentMethod: string;
    itemName: string;
    email: string;
    tax: number;
    amount: number;
    total: number;
    createdAt?: Date;
    isDeleted?: Boolean;
}
export declare const InvoiceSchema: import("mongoose").Schema<any>;
