import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlTrackingConfigDocument = UrlTrackingConfig &  Document;

@Schema()
export class UrlTrackingConfig {

  @Prop({})
  url: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default:1 })
  status: Boolean;

  @Prop({})
  uId: string;

}

export const UrlTrackingConfigSchema = SchemaFactory.createForClass(UrlTrackingConfig);