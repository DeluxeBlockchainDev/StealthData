import { Model } from 'mongoose';
import { SubscriptionDocument } from '../schemas/subscription.schema';
import { CreateSubscriptionDto, SubscriptionSearchParamsDto, UpdateSubscriptionDto } from '../dto/subscription.dto';
export declare class SubscriptionService {
    private subscriptionModel;
    constructor(subscriptionModel: Model<SubscriptionDocument>);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionDocument>;
    findOneAndUpdate(params: SubscriptionSearchParamsDto, updateSubscriptionDto: UpdateSubscriptionDto): Promise<SubscriptionDocument>;
    delete(_id: string): Promise<SubscriptionDocument>;
    findOne(params: SubscriptionSearchParamsDto): Promise<SubscriptionDocument>;
    findAll(params?: SubscriptionSearchParamsDto): Promise<SubscriptionDocument[]>;
    checkSubscriptionAmount(subscriptionId: any, amount: any, type: any): Promise<boolean>;
}
