import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {

  @Prop({})
  name: string;

  @Prop({ default: '' })
  html: string;

  @Prop({ default: 4000 })
  uniqueVisitorsMonthlyLimit: number;

  @Prop({ default: false })
  isHotPriorityAllowed: boolean;

  @Prop({ default: true })
  isDashboardAllowed: boolean;

  @Prop({ default: true })
  isCrmMatchingAllowed: boolean;

  @Prop({ default: true })
  isEmailCampaignsAllowed: boolean;

  @Prop({ default: true })
	isVisits: boolean;

  @Prop({ default: true })
	isUrlsViewed: boolean;

  @Prop({ default: true })
	isLeadPriority: boolean;

  @Prop({ default: true })
	isCrmMatched: boolean;

  @Prop({ default: true })
	isDashboardCrmMatched: boolean;

  @Prop({ default: true })
	isMonthlyLeadPriority: boolean;
  
  @Prop({ default: true })
	isMonthlyEmailStats: boolean;
  
  @Prop({ default: true })
	isTop5Urls: boolean;
  
  @Prop({ default: true })
	isTopVisitors: boolean;
  
  @Prop({ default: true })
	isAccessToCorporate: boolean;
  
  @Prop({ default: true })
	isAdvancedXLSXExport: boolean;

  @Prop({ default: true })
	customUrlTracking: boolean;

  @Prop({ default: true })
	customLeadPriority: boolean;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  annualDiscount: number;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: true })
  isActive: Boolean;

  @Prop({ default: false })
  isDeleted: Boolean;

  @Prop({ default: 0 })
  listOrder: number;

  @Prop({ default: 0 })
	additionalFee: number;
  
  @Prop({ default: false })
	isCustomPackage: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);