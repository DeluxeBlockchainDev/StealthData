import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CrmMatchingHistory, CrmMatchingHistoryDocument } from '../schemas/crmmatchinghistory.schema';
import { CreateCrmMatchingHistoryDto } from '../dto/crmmatchinghistory.dto';

@Injectable()
export class CrmMatchingHistoryService {
  constructor(@InjectModel(CrmMatchingHistory.name) private crmMatchingHistoryModel: Model<CrmMatchingHistoryDocument>) {}

  async create(createCmhDto: CreateCrmMatchingHistoryDto): Promise<CrmMatchingHistoryDocument> {
    const createdCmh = new this.crmMatchingHistoryModel(createCmhDto);
    return createdCmh.save();
  }

  async bulkWrite(paramsArr: any[]): Promise<any> {
    return this.crmMatchingHistoryModel.bulkWrite(paramsArr);
  }

  async aggregate(pipeline: any): Promise<any> {
    return this.crmMatchingHistoryModel.aggregate(pipeline);
  }

  async findAll(params?:any): Promise<CrmMatchingHistoryDocument[]> {
    return this.crmMatchingHistoryModel.find({ ...params }).exec();
  }

  async fetchAll(): Promise<CrmMatchingHistoryDocument[]> {
    return this.crmMatchingHistoryModel.find();
  }

  async delete(_id:string): Promise<CrmMatchingHistoryDocument> {
    return this.crmMatchingHistoryModel.findOneAndUpdate({ _id: _id }, { isDeleted: true }, {useFindAndModify: false}).exec();
  }
}