"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const subscription_schema_1 = require("../schemas/subscription.schema");
const utills_1 = require("../../common/utills");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionModel) {
        this.subscriptionModel = subscriptionModel;
    }
    async create(createSubscriptionDto) {
        const createdSubscription = new this.subscriptionModel(createSubscriptionDto);
        return createdSubscription.save();
    }
    async findOneAndUpdate(params, updateSubscriptionDto) {
        return this.subscriptionModel.findOneAndUpdate(params, updateSubscriptionDto).exec();
    }
    async delete(_id) {
        return this.subscriptionModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
    }
    async findOne(params) {
        return this.subscriptionModel.findOne(Object.assign(Object.assign({}, params), { isDeleted: false })).exec();
    }
    async findAll(params) {
        return this.subscriptionModel.find(Object.assign(Object.assign({}, params), { isDeleted: false })).sort({ listOrder: 1 }).exec();
    }
    async checkSubscriptionAmount(subscriptionId, amount, type) {
        const subscription = await this.findOne({ _id: subscriptionId });
        const subscriptionAmount = type === 'a' ? utills_1.calculateAnnualPrice(subscription.price, subscription.annualDiscount) : subscription.price;
        return subscriptionAmount === amount;
    }
};
SubscriptionService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map