import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription, SubscriptionDocument } from '../schemas/subscription.schema';
import { CreateSubscriptionDto, SubscriptionSearchParamsDto, UpdateSubscriptionDto } from '../dto/subscription.dto';
import { calculateAnnualPrice } from 'src/common/utills';

@Injectable()
export class SubscriptionService {
  constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<SubscriptionDocument> {
    const createdSubscription = new this.subscriptionModel(createSubscriptionDto);
    return createdSubscription.save();
  }

  async findOneAndUpdate(params:SubscriptionSearchParamsDto, updateSubscriptionDto: UpdateSubscriptionDto): Promise<SubscriptionDocument> {
    return this.subscriptionModel.findOneAndUpdate(params, updateSubscriptionDto).exec();
  }

  async delete(_id:string): Promise<SubscriptionDocument> {
    return this.subscriptionModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
  }

  async findOne(params:SubscriptionSearchParamsDto): Promise<SubscriptionDocument> {
    return this.subscriptionModel.findOne({ ...params, isDeleted: false }).exec();
  }

  async findAll(params?:SubscriptionSearchParamsDto): Promise<SubscriptionDocument[]> {
    return this.subscriptionModel.find({ ...params, isDeleted: false }).sort({listOrder : 1}).exec();
  }

  async checkSubscriptionAmount( subscriptionId, amount, type ) {
    const subscription = await this.findOne({ _id: subscriptionId });
    const subscriptionAmount = type === 'a' ? calculateAnnualPrice(subscription.price, subscription.annualDiscount) : subscription.price;
    return subscriptionAmount === amount;
  }
}
