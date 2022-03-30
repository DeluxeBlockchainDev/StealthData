import { Model } from 'mongoose';
import { UrlTrackingConfigDocument } from '../schemas/urltrackingconfig.schema';
import { CreateUrlTrackingConfigDto } from '../dto/urltrackingconfig.dto';
export declare class UrlTrackingConfigService {
    private urlTrackingConfigModel;
    constructor(urlTrackingConfigModel: Model<UrlTrackingConfigDocument>);
    create(createUtcDto: CreateUrlTrackingConfigDto): Promise<UrlTrackingConfigDocument>;
    bulkWrite(paramsArr: any[]): Promise<any>;
    aggregate(pipeline: any): Promise<any>;
    findOneAndUpdate(_id: string, params: any): Promise<UrlTrackingConfigDocument>;
    findAll(params?: any): Promise<UrlTrackingConfigDocument[]>;
    fetchAll(): Promise<UrlTrackingConfigDocument[]>;
    delete(_id: string): Promise<UrlTrackingConfigDocument>;
}
