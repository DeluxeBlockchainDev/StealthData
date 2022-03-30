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
exports.CampaignStatSchema = exports.CampaignStat = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let CampaignStat = class CampaignStat {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CampaignStat.prototype, "campaignName", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CampaignStat.prototype, "campaignId", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CampaignStat.prototype, "messageId", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "uniqueOpenRate", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "clickRate", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "linksClicked", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "uniqueClickRate", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "unsubscribeRate", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "totalUnsubscribed", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "emailsSent", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "emailsDelivered", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "emailsOpened", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CampaignStat.prototype, "totalEmailsSent", void 0);
__decorate([
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], CampaignStat.prototype, "clientId", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CampaignStat.prototype, "fileName", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], CampaignStat.prototype, "createdAt", void 0);
CampaignStat = __decorate([
    mongoose_1.Schema()
], CampaignStat);
exports.CampaignStat = CampaignStat;
exports.CampaignStatSchema = mongoose_1.SchemaFactory.createForClass(CampaignStat);
//# sourceMappingURL=campaign-stat.schema%20copy.js.map