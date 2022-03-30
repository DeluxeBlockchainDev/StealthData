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
exports.EmailCampaignService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const email_campaign_schema_1 = require("../schemas/email-campaign.schema");
let EmailCampaignService = class EmailCampaignService {
    constructor(emailCampaignModel) {
        this.emailCampaignModel = emailCampaignModel;
    }
    async create(createEmailCampaignDto) {
        const createdEmailCampaign = new this.emailCampaignModel(createEmailCampaignDto);
        return createdEmailCampaign.save();
    }
    async findOneAndUpdate(params, updateEmailCampaignDto) {
        return this.emailCampaignModel.findOneAndUpdate(params, updateEmailCampaignDto).exec();
    }
    async delete(_id) {
        return this.emailCampaignModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
    }
    async findOne(params) {
        return this.emailCampaignModel.findOne(Object.assign(Object.assign({}, params), { isDeleted: false })).exec();
    }
    async findAll(params) {
        return this.emailCampaignModel.find(Object.assign(Object.assign({}, params), { isDeleted: false })).exec();
    }
};
EmailCampaignService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(email_campaign_schema_1.EmailCampaign.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], EmailCampaignService);
exports.EmailCampaignService = EmailCampaignService;
//# sourceMappingURL=email-campaign.service.js.map