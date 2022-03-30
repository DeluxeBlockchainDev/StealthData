import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CampaignStatDocument = CampaignStat &  Document;

@Schema()
export class CampaignStat {

  @Prop({})
  campaignName: string;

  @Prop({})
  campaignId: string;

  @Prop({})
  messageId: string;

  @Prop({ default:0 })
  uniqueOpenRate: number;

  @Prop({ default:0 })
  clickRate: number;

  @Prop({ default:0 })
  linksClicked: number;

  @Prop({ default:0 })
  uniqueClickRate: number;

  @Prop({ default:0 })
  unsubscribeRate: number;

  @Prop({ default:0 })
  totalUnsubscribed: number;

  @Prop({ default:0 })
  emailsSent: number;

  @Prop({ default:0 })
  emailsDelivered: number;

  @Prop({ default:0 })
  emailsOpened: number;

  @Prop({ default:0 })
  totalEmailsSent: number;

  @Prop({ required: true })
  clientId: string;

  @Prop({})
  fileName: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CampaignStatSchema = SchemaFactory.createForClass(CampaignStat);
