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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const stealth_service_1 = require("../../common/services/stealth.service");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const subscription_service_1 = require("../services/subscription.service");
const subscription_dto_1 = require("../dto/subscription.dto");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService, stealthService) {
        this.subscriptionService = subscriptionService;
        this.stealthService = stealthService;
    }
    create(createDto) {
        const subscription = this.subscriptionService.create(createDto);
        return subscription;
    }
    update(_id, updateDto) {
        const updatedSubscription = this.subscriptionService.findOneAndUpdate({ _id }, updateDto);
        return updatedSubscription;
    }
    read(_id) {
        const subscription = this.subscriptionService.findOne({ _id });
        return subscription;
    }
    findAll() {
        const subscriptions = this.subscriptionService.findAll();
        return subscriptions;
    }
};
__decorate([
    common_1.Post(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "update", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "read", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "findAll", null);
SubscriptionController = __decorate([
    common_1.Controller('subscription'),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService, stealth_service_1.StealthService])
], SubscriptionController);
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=subscription.controller.js.map