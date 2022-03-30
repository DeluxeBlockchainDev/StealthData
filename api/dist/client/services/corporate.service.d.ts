/// <reference types="mongoose-paginate" />
import { PaginateModel } from 'mongoose';
import { CorporateDocument } from '../schemas/corporate.schema';
import { ICreateCorporate, ISearchCorporate } from '../interfaces/corporate.interface';
export declare class CorporateService {
    private corporateModel;
    constructor(corporateModel: PaginateModel<CorporateDocument>);
    create(createCorporate: ICreateCorporate): Promise<CorporateDocument>;
    findAll(params?: ISearchCorporate, selectParams?: any, limit?: number, skip?: number): Promise<CorporateDocument[]>;
    bulkWrite(paramsArr: any[]): Promise<any>;
}
