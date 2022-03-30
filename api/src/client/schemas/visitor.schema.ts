import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export type VisitorDocument = Visitor & Document;

@Schema()
export class Visitor {

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  loginAPIAccessKey?: string
  
  @Prop({ default: Date })
  lastVisitedAt: Date;
  
  @Prop({ default: '' })
  customerFlag: string;
  
  @Prop({ default: '' })
  igIndividualId: string;
  
  @Prop({ default: '' })
  firstName: string;
  
  @Prop({ default: '' })
  lastName: string;
  
  @Prop({ default: '' })
  address: string;
  
  @Prop({ default: '' })
  city: string;
  
  @Prop({ default: '' })
  state: string;
  
  @Prop({ default: '' })
  zipcode: string;

  @Prop({ default: '' })
  phoneNo: string;

  @Prop({ default: 'mild' })
  priority: string;

  @Prop({ default: '' })
  autoResponderListName: string;

  @Prop({ default: null })
  autoResponderListDate: Date;

  @Prop({ default: 0 })
  visitCount: number;

  @Prop({ default: null })
  crmMatchDate?: Date;

  @Prop({ default: null })
  crmMatchId?: string;

  @Prop({ default: Date.now })
  dateIdentified?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: false })
  isDeleted?: Boolean;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);

VisitorSchema.plugin(mongoosePaginate);