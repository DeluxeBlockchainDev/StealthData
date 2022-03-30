import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailCampaign, EmailCampaignDocument } from '../schemas/email-campaign.schema';
import { CreateEmailCampaignDto, EmailCampaignSearchParamsDto, UpdateEmailCampaignDto } from '../dto/email-campaign.dto';

@Injectable()
export class EmailCampaignService {
  constructor(@InjectModel(EmailCampaign.name) private emailCampaignModel: Model<EmailCampaignDocument>) {}

  async create(createEmailCampaignDto: CreateEmailCampaignDto): Promise<EmailCampaignDocument> {
    const createdEmailCampaign = new this.emailCampaignModel(createEmailCampaignDto);
    return createdEmailCampaign.save();
  }

  async findOneAndUpdate(params:EmailCampaignSearchParamsDto, updateEmailCampaignDto: UpdateEmailCampaignDto): Promise<EmailCampaignDocument> {
    return this.emailCampaignModel.findOneAndUpdate(params, updateEmailCampaignDto).exec();
  }

  async delete(_id:string): Promise<EmailCampaignDocument> {
    return this.emailCampaignModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
  }

  async findOne(params:EmailCampaignSearchParamsDto): Promise<EmailCampaignDocument> {
    return this.emailCampaignModel.findOne({ ...params, isDeleted: false }).exec();
  }

  async findAll(params?:EmailCampaignSearchParamsDto): Promise<EmailCampaignDocument[]> {
    return this.emailCampaignModel.find({ ...params, isDeleted: false }).exec();
  }
}
