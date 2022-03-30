import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UrlTrackingConfig, UrlTrackingConfigDocument } from '../schemas/urltrackingconfig.schema';
import { CreateUrlTrackingConfigDto } from '../dto/urltrackingconfig.dto';

@Injectable()
export class UrlTrackingConfigService {
  constructor(@InjectModel(UrlTrackingConfig.name) private urlTrackingConfigModel: Model<UrlTrackingConfigDocument>) {}

  async create(createUtcDto: CreateUrlTrackingConfigDto): Promise<UrlTrackingConfigDocument> {
    const createdUtc = new this.urlTrackingConfigModel(createUtcDto);
    return createdUtc.save();
  }

  async bulkWrite(paramsArr: any[]): Promise<any> {
    return this.urlTrackingConfigModel.bulkWrite(paramsArr);
  }

  async aggregate(pipeline: any): Promise<any> {
    return this.urlTrackingConfigModel.aggregate(pipeline);
  }
  async findOneAndUpdate(_id:string, params: any ): Promise<UrlTrackingConfigDocument> {
    return this.urlTrackingConfigModel.findOneAndUpdate({ _id: _id }, params, {useFindAndModify: false}).exec();
  }

  async findAll(params?:any): Promise<UrlTrackingConfigDocument[]> {
    return this.urlTrackingConfigModel.find({ ...params }).exec();
  }

  async fetchAll(): Promise<UrlTrackingConfigDocument[]> {
    return this.urlTrackingConfigModel.find();
  }

  async delete(_id:string): Promise<UrlTrackingConfigDocument> {
    return this.urlTrackingConfigModel.findOneAndDelete({ _id: _id }).exec();
  }
}