import { Model } from 'mongoose';
import { CrmMatchingHistoryDocument } from '../schemas/crmmatchinghistory.schema';
import { CreateCrmMatchingHistoryDto } from '../dto/crmmatchinghistory.dto';
export declare class CrmMatchingHistoryService {
    private crmMatchingHistoryModel;
    constructor(crmMatchingHistoryModel: Model<CrmMatchingHistoryDocument>);
    create(createCmhDto: CreateCrmMatchingHistoryDto): Promise<CrmMatchingHistoryDocument>;
    bulkWrite(paramsArr: any[]): Promise<any>;
    aggregate(pipeline: any): Promise<any>;
    findAll(params?: any): Promise<CrmMatchingHistoryDocument[]>;
    fetchAll(): Promise<CrmMatchingHistoryDocument[]>;
    delete(_id: string): Promise<CrmMatchingHistoryDocument>;
}
