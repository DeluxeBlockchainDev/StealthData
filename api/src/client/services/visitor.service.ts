import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Visitor, VisitorDocument } from '../schemas/visitor.schema';
import { ICreateVisitor, ISearchVisitors, IUpdateVisitor } from '../interfaces/visitor.interface';

@Injectable()
export class VisitorService {
  constructor(@InjectModel(Visitor.name) private visitorModel: PaginateModel<VisitorDocument>) {}

  async create(createVisitor: ICreateVisitor): Promise<VisitorDocument> {
    const createdVisitor = new this.visitorModel(createVisitor);
    return createdVisitor.save();
  }

  async findOneAndUpdate(params:ISearchVisitors, updateVisitorParams: IUpdateVisitor): Promise<VisitorDocument> {
    return this.visitorModel.findOneAndUpdate(params, updateVisitorParams).exec();
  }

  async delete(_id:string): Promise<VisitorDocument> {
    return this.visitorModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
  }

  async remove(query:any): Promise<any> {
    return this.visitorModel.remove({ ...query }).exec();
  }

  async findOne(params:ISearchVisitors): Promise<VisitorDocument> {
    return this.visitorModel.findOne({ ...params, isDeleted: false }, { lean: true }).sort({ _id: -1 }).exec();
  }

  async findAll(params?:ISearchVisitors, selectParams?:any, limit?:number, skip?:number): Promise<VisitorDocument[]> {
    const query = this.visitorModel.find({ ...params, isDeleted: false }, { ...( selectParams ? {...selectParams} : {} )}).sort({ _id: -1 });
    
    if(limit !== null && limit !== undefined) {
      query.limit(limit);
    }

    if(skip !== null && skip !== undefined) {
      query.skip(skip);
    }

    return query.exec();
  }

  async count(params?:ISearchVisitors): Promise<number> {
    return this.visitorModel.find({ ...params, isDeleted: false }).sort({ _id: -1 }).countDocuments().exec();
  }

  async paginate( page: number = 1, limit: number = 10, params?:any, sort?:any ): Promise<PaginateResult<VisitorDocument>> {
    return this.visitorModel.paginate({ ...params, isDeleted: false }, { limit, page, sort: { ...( !!sort ? { [sort.field]: sort.order } : { lastVisitedAt: -1 } ) } });
  }

  async bulkInsert(createVisitorArr: any): Promise<any> {
    return this.visitorModel.insertMany(createVisitorArr);
  }

  async bulkWrite(paramsArr: any[]): Promise<any> {
    return this.visitorModel.bulkWrite(paramsArr);
  }

  async aggregate(pipeline: any): Promise<any> {
    return this.visitorModel.aggregate(pipeline);
  }

  async updateMany(params:ISearchVisitors, updateVisitorParams: IUpdateVisitor): Promise<any> {
    return this.visitorModel.updateMany(params, updateVisitorParams).exec();
  }
}
