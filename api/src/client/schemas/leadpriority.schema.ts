import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export type LeadPriorityDocument = LeadPriorityData & Document;

@Schema()
export class LeadPriorityData {

  @Prop({ default: '' })
  clientId: string;

  @Prop({ default: '' })
  loginAPIAccessKey?: string
  
  @Prop({ default: '' })
  mild: number;

  @Prop({ default: '' })
  warm: number;

  @Prop({ default: '' })
  hot: number;
  
  @Prop({ default: Date.now })
  createdAt?: Date;

}

export const LeadPrioritySchema = SchemaFactory.createForClass(LeadPriorityData);

LeadPrioritySchema.plugin(mongoosePaginate);