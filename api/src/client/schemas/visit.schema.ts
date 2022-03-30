import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export type VisitDocument = Visit & Document;

@Schema()
export class Visit {

  @Prop({ default: '' })
  loginAPIAccessKey?: string
  
  @Prop({ default: Date })
  visitedAt: Date;
  
  @Prop({ default: '' })
  pageUrl: string;
  
  @Prop({ default: '' })
  igIndividualId: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: false })
  isDeleted?: Boolean;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);

VisitSchema.plugin(mongoosePaginate);