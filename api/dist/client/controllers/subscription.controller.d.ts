import { StealthService } from 'src/common/services/stealth.service';
import { SubscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/subscription.dto';
export declare class SubscriptionController {
    private subscriptionService;
    private stealthService;
    constructor(subscriptionService: SubscriptionService, stealthService: StealthService);
    create(createDto: CreateSubscriptionDto): Promise<import("../schemas/subscription.schema").SubscriptionDocument>;
    update(_id: string, updateDto: UpdateSubscriptionDto): Promise<import("../schemas/subscription.schema").SubscriptionDocument>;
    read(_id: string): Promise<import("../schemas/subscription.schema").SubscriptionDocument>;
    findAll(): Promise<import("../schemas/subscription.schema").SubscriptionDocument[]>;
}
