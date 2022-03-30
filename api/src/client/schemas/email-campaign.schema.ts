import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailCampaignDocument = EmailCampaign & Document;

@Schema()
export class EmailCampaign {

  @Prop({})
  name: string;

  @Prop({})
  clientId: string;

  @Prop({ default: '' })
  html: string;

  @Prop({ type: Object })
  editorDesign: any;
  
  @Prop({ default: '' })
  fromField: string;

  @Prop({ default: '' })
  replyTo: string;

  @Prop({ default: '' })
  subject: string;

  @Prop({ default: '' })
  autoResponderId: string;

  @Prop({ default: '' })
  campaignTypeId: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: true })
  isActive: Boolean;

  @Prop({ default: false })
  isDeleted: Boolean;
}

export const EmailCampaignSchema = SchemaFactory.createForClass(EmailCampaign);