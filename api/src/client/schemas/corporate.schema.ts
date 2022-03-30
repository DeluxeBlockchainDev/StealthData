import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export type CorporateDocument = CorporateData & Document;

@Schema()
export class CorporateData {

  @Prop({ default: '' })
  corporateId: string;

  @Prop({ default: '' })
  likeliHood : number;
  
  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  loginAPIAccessKey?: string
  
  @Prop({ default: '' })
  fullName: string;

  @Prop({ default: '' })
  gender: string;

  @Prop({ default: '' })
  birthYear: string;

  @Prop({ default: '' })
  birthDate: string;
  
  @Prop({ default: '' })
  linkedInURL: string;
  
  @Prop({ default: '' })
  linkedInUsername: string;
  
  @Prop({ default: '' })
  facebookURL: string;
  
  @Prop({ default: '' })
  facebookUsername: string;

  @Prop({ default: '' })
  twitterURL: string;
  
  @Prop({ default: '' })
  twitterUsername: string;

  @Prop({ default: '' })
  githubURL: string;
  
  @Prop({ default: '' })
  githubUsername: string;

  @Prop({ default: '' })
  workMail: string;
  
  @Prop({ default: '' })
  jobTitle: string;
  
  @Prop({ default: '' })
  jobTitleRole: string;
  
  @Prop({ default: '' })
  jobCompanyId: string;
  
  @Prop({ default: '' })
  jobCompanyName: string;

  @Prop({ default: '' })
  jobCompanyWebsite: string;

  @Prop({ default: 'mild' })
  jobCompanySize: string;

  @Prop({ default: '' })
  jobCompanyIndustry: string;

  @Prop({ default: '' })
  jobCompanyLocationMetro: string;

  @Prop({ default: '' })
  jobCompanyFacebookURL: string;

  @Prop({ default: '' })
  jobCompanyLinkedInURL: string;

  @Prop({ default: '' })
  jobCompanyTwitterURL: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: false })
  isDeleted?: Boolean;
}

export const CorporateSchema = SchemaFactory.createForClass(CorporateData);

CorporateSchema.plugin(mongoosePaginate);