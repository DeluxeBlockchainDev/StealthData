/// <reference types="mongoose-paginate" />
import { PaginateModel, PaginateResult } from 'mongoose';
import { VisitDocument } from '../schemas/visit.schema';
import { ICreateVisit, ISearchVisit, IUpdateVisit } from '../interfaces/visit.interface';
export declare class VisitService {
    private visitModel;
    constructor(visitModel: PaginateModel<VisitDocument>);
    create(createVisit: ICreateVisit): Promise<VisitDocument>;
    findOneAndUpdate(params: ISearchVisit, updateVisitParams: IUpdateVisit): Promise<VisitDocument>;
    delete(_id: string): Promise<VisitDocument>;
    findOne(params: ISearchVisit): Promise<VisitDocument>;
    findAll(params?: ISearchVisit, select?: any): Promise<VisitDocument[]>;
    paginate(offset?: number, limit?: number, params?: any): Promise<PaginateResult<VisitDocument>>;
    bulkInsert(createVisitArr: any): Promise<any>;
    aggregate(pipeline: any): Promise<any>;
}
