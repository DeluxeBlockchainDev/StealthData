import { Model } from 'mongoose';
import { UnsubscribedUserDocument } from '../schemas/unsubscribed-user.schema';
export declare class UnsubscribedUserService {
    private model;
    constructor(model: Model<UnsubscribedUserDocument>);
    bulkWrite(paramsArr: any[]): Promise<any>;
    aggregate(pipeline: any): Promise<any>;
    findAll(params?: any): Promise<UnsubscribedUserDocument[]>;
}
