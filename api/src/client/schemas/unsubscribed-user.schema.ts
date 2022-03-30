import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnsubscribedUserDocument = UnsubscribedUser &  Document;

@Schema()
export class UnsubscribedUser {

  @Prop({})
  campaignName: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  deletedAt: Date;

  @Prop({})
  fileName: string;
  
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UnsubscribedUserSchema = SchemaFactory.createForClass(UnsubscribedUser);
