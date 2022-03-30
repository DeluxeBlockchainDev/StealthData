import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Visit, VisitDocument } from '../schemas/visit.schema';
import { ICreateVisit, ISearchVisit, IUpdateVisit} from '../interfaces/visit.interface';

@Injectable()
export class VisitService {
  constructor(@InjectModel(Visit.name) private visitModel: PaginateModel<VisitDocument>) {}

  async create(createVisit: ICreateVisit): Promise<VisitDocument> {
    const createdVisit = new this.visitModel(createVisit);
    return createdVisit.save();
  }

  async findOneAndUpdate(params:ISearchVisit, updateVisitParams: IUpdateVisit ): Promise<VisitDocument> {
    return this.visitModel.findOneAndUpdate(params, updateVisitParams).exec();
  }

  async delete(_id:string): Promise<VisitDocument> {
    return this.visitModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
  }

  async findOne(params:ISearchVisit): Promise<VisitDocument> {
    return this.visitModel.findOne({ ...params, isDeleted: false }).sort({ _id: -1 }).exec();
  }

  async findAll(params?:ISearchVisit, select?:any): Promise<VisitDocument[]> {
    return this.visitModel.find({ ...params, isDeleted: false }, !!select ? select : {}).sort({ _id: -1 }).exec();
  }

  async paginate( offset: number = 0, limit: number = 10, params?:any ): Promise<PaginateResult<VisitDocument>> {
    return this.visitModel.paginate({ ...params, isDeleted: false }, { limit, offset, sort: { visitedAt: -1 } });
  }

  async bulkInsert(createVisitArr: any): Promise<any> {
    return this.visitModel.insertMany(createVisitArr);
  }

  async aggregate(pipeline: any): Promise<any> {
    return this.visitModel.aggregate(pipeline);
  }
}
