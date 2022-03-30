import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { Address } from './client.schema';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {

  @Prop({ default: '' })
  clientId: string;

  @Prop({ default: '' })
  billingAddress?: Address;

  @Prop({ default: '' })
  billedTo?: string;
  
  @Prop({ enum: ['credit','check'] })
  paymentMethod: string;

  @Prop({})
  itemName: string;

  @Prop({})
  email: string;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: false })
  isDeleted?: Boolean;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.plugin(mongoosePaginate);