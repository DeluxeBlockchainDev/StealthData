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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSchema = exports.Subscription = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Subscription = class Subscription {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Subscription.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Subscription.prototype, "html", void 0);
__decorate([
    mongoose_1.Prop({ default: 4000 }),
    __metadata("design:type", Number)
], Subscription.prototype, "uniqueVisitorsMonthlyLimit", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isHotPriorityAllowed", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isDashboardAllowed", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isCrmMatchingAllowed", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isEmailCampaignsAllowed", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isVisits", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isUrlsViewed", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isLeadPriority", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isCrmMatched", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isDashboardCrmMatched", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isMonthlyLeadPriority", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isMonthlyEmailStats", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isTop5Urls", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isTopVisitors", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isAccessToCorporate", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isAdvancedXLSXExport", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "customUrlTracking", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "customLeadPriority", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "price", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "annualDiscount", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now() }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isActive", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isDeleted", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "listOrder", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Subscription.prototype, "additionalFee", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isCustomPackage", void 0);
Subscription = __decorate([
    mongoose_1.Schema()
], Subscription);
exports.Subscription = Subscription;
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
//# sourceMappingURL=subscription.schema.js.map