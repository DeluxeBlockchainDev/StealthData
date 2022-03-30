import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CorporateData, CorporateDocument } from '../schemas/corporate.schema';
import { ICreateCorporate, ISearchCorporate } from '../interfaces/corporate.interface';

@Injectable()
export class CorporateService {
  constructor(@InjectModel(CorporateData.name) private corporateModel: PaginateModel<CorporateDocument>) {}

  async create(createCorporate: ICreateCorporate): Promise<CorporateDocument> {
    const createdCorporate = new this.corporateModel(createCorporate);
    return createdCorporate.save();
  }

  async findAll(params?:ISearchCorporate, selectParams?:any, limit?:number, skip?:number): Promise<CorporateDocument[]> {
    const query = this.corporateModel.find({ ...params, isDeleted: false }, { ...( selectParams ? {...selectParams} : {} )}).sort({ _id: -1 });
    
    if(limit !== null && limit !== undefined) {
      query.limit(limit);
    }

    if(skip !== null && skip !== undefined) {
      query.skip(skip);
    }

    return query.exec();
  }

  async bulkWrite(paramsArr: any[]): Promise<any> {
    return this.corporateModel.bulkWrite(paramsArr);
  }
}
