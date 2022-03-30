import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from '../schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>) {}

  async create(params): Promise<any> {
    const createdVisitor = new this.invoiceModel(params);
    return createdVisitor.save();
  }

  async findOneAndUpdate(searchParams, updateParams): Promise<any> {
    return this.invoiceModel.findOneAndUpdate(searchParams, updateParams).exec();
  }

  async delete(_id:string): Promise<InvoiceDocument> {
    return this.invoiceModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
  }

  async findOne(params): Promise<InvoiceDocument> {
    return this.invoiceModel.findOne({ ...params, isDeleted: false }).sort({ _id: -1 }).exec();
  }

  async findAll(params, selectParams?:any): Promise<InvoiceDocument[]> {
    return this.invoiceModel.find({ ...params, isDeleted: false }, { ...( selectParams ? {...selectParams} : {} )}).sort({ _id: -1 }).exec();
  }

}
