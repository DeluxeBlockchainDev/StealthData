import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeadPriorityData, LeadPriorityDocument } from '../schemas/leadpriority.schema';
import { CreateLeadPriority, LeadPrioritySearchParamsDto } from '../dto/leadpriority.dto';

@Injectable()
export class LeadPriorityService {
  constructor(@InjectModel(LeadPriorityData.name) private lpModel: PaginateModel<LeadPriorityDocument>) {}

  async create(createCorporate: CreateLeadPriority): Promise<LeadPriorityDocument> {
    const createdCorporate = new this.lpModel(createCorporate);
    return createdCorporate.save();
  }

  async findOne(params:any): Promise<LeadPriorityDocument> {
    return this.lpModel.findOne({ ...params }, { }, { lean: true }).sort({ createdAt: -1 }).exec();
  }

  async findAll(params?:CreateLeadPriority, selectParams?:any, limit?:number, skip?:number): Promise<LeadPriorityDocument[]> {
    const query = this.lpModel.find({ ...params, isDeleted: false }, { ...( selectParams ? {...selectParams} : {} )}).sort({ _id: -1 });
    
    if(limit !== null && limit !== undefined) {
      query.limit(limit);
    }

    if(skip !== null && skip !== undefined) {
      query.skip(skip);
    }

    return query.exec();
  }

  async paginate( page: number = 1, limit: number = 10,sort={createdAt:1}, params?:LeadPrioritySearchParamsDto ): Promise<PaginateResult<LeadPriorityDocument>> {
    return this.lpModel.paginate({ ...params },{ select: {clientId : 0}, limit, page,sort });
  }
}
