import { Model } from 'mongoose';
import { InvoiceDocument } from '../schemas/invoice.schema';
export declare class InvoiceService {
    private invoiceModel;
    constructor(invoiceModel: Model<InvoiceDocument>);
    create(params: any): Promise<any>;
    findOneAndUpdate(searchParams: any, updateParams: any): Promise<any>;
    delete(_id: string): Promise<InvoiceDocument>;
    findOne(params: any): Promise<InvoiceDocument>;
    findAll(params: any, selectParams?: any): Promise<InvoiceDocument[]>;
}
