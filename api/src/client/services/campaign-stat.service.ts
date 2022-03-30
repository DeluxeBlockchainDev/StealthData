import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CampaignStat, CampaignStatDocument } from '../schemas/campaign-stat.schema';

@Injectable()
export class CampaignStatService {
  constructor(@InjectModel(CampaignStat.name) private model: Model<CampaignStatDocument>) {}

  async bulkWrite(paramsArr: any[]): Promise<any> {
    return this.model.bulkWrite(paramsArr);
  }

  async aggregate(pipeline: any): Promise<any> {
    return this.model.aggregate(pipeline);
  }

  async findAll(params?:any): Promise<CampaignStatDocument[]> {
    return this.model.find({ ...params }).exec();
  }
}
