import { Model } from 'mongoose';
import { CampaignStatDocument } from '../schemas/campaign-stat.schema';
export declare class CampaignStatService {
    private model;
    constructor(model: Model<CampaignStatDocument>);
    bulkWrite(paramsArr: any[]): Promise<any>;
    aggregate(pipeline: any): Promise<any>;
    findAll(params?: any): Promise<CampaignStatDocument[]>;
}
