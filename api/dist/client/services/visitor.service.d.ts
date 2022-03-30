/// <reference types="mongoose-paginate" />
import { PaginateModel, PaginateResult } from 'mongoose';
import { VisitorDocument } from '../schemas/visitor.schema';
import { ICreateVisitor, ISearchVisitors, IUpdateVisitor } from '../interfaces/visitor.interface';
export declare class VisitorService {
    private visitorModel;
    constructor(visitorModel: PaginateModel<VisitorDocument>);
    create(createVisitor: ICreateVisitor): Promise<VisitorDocument>;
    findOneAndUpdate(params: ISearchVisitors, updateVisitorParams: IUpdateVisitor): Promise<VisitorDocument>;
    delete(_id: string): Promise<VisitorDocument>;
    remove(query: any): Promise<any>;
    findOne(params: ISearchVisitors): Promise<VisitorDocument>;
    findAll(params?: ISearchVisitors, selectParams?: any, limit?: number, skip?: number): Promise<VisitorDocument[]>;
    count(params?: ISearchVisitors): Promise<number>;
    paginate(page?: number, limit?: number, params?: any, sort?: any): Promise<PaginateResult<VisitorDocument>>;
    bulkInsert(createVisitorArr: any): Promise<any>;
    bulkWrite(paramsArr: any[]): Promise<any>;
    aggregate(pipeline: any): Promise<any>;
    updateMany(params: ISearchVisitors, updateVisitorParams: IUpdateVisitor): Promise<any>;
}
