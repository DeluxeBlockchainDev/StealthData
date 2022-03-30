import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export type ClientDocument = Client &  Document;

@Schema()
export class App {

  @Prop({})
  url: string;

  @Prop({ default: {}, type: Object })
  req?: any;

  @Prop({ default: '' })
  loginGUID?: string

  @Prop({ default: '' })
	loginAPIAccessKey?: string
}

@Schema()
export class CardInfo {
	@Prop({ default: '' })
	name: string;

	@Prop({ default: '' })
	cardnumber: string;

  @Prop({ default: '' })
	cvv: string;

  @Prop({ default: '' })
	expiredate: string;

}
@Schema()
export class Address {

  @Prop({ })
  line1: string;

  @Prop({ default: '' })
  line2?: string;

  @Prop({ default: '' })
  city?: string
  
  @Prop({ default: '' })
  zipcode?: string

  @Prop({ default: '' })
  state?: string
  
  @Prop({ default: 'USA' })
	country?: string
}

@Schema()
export class Client {

  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({})
  password: string;

  @Prop({})
  username: string;

  @Prop({})
  email: string;

  @Prop({})
  description: string;

  @Prop({})
  subscriptionId: string;

  @Prop({})
  contactNo: string;

  @Prop({})
  companyName: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: [] })
  fromFields: string[];

  @Prop({})
  apps: App[]

  @Prop({ default: '' })
  customerGUID: string;

  @Prop({})
  address: Address;

  @Prop({ default: 0 })
  monthlyVisitorIdentificationAlertCount: number;

  @Prop({ default: 'live', enum: ['live', 'paused', 'cancelled', 'deleted', 'paused_backend'] })
  status: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: true })
  isActive: Boolean;

  @Prop({ default: 0 })
  uniqueVisitorsMonthly: number;

  @Prop({ default: false })
  isDeleted: Boolean;

  @Prop({})
  cardInfo: CardInfo;

  @Prop({ default: '' })
  isAdditionalFee: boolean;

  @Prop({ default: ''})
  customerProfileId: string;

  @Prop({ default: ''})
  customerPaymentProfileId: string;

  @Prop({})
  lastBillingDate: Date;

  @Prop({ default: false })
  isLeadProritySet: Boolean;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.plugin(mongoosePaginate);
