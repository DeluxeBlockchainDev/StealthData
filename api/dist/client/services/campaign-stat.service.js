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
exports.CampaignStatService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const campaign_stat_schema_1 = require("../schemas/campaign-stat.schema");
let CampaignStatService = class CampaignStatService {
    constructor(model) {
        this.model = model;
    }
    async bulkWrite(paramsArr) {
        return this.model.bulkWrite(paramsArr);
    }
    async aggregate(pipeline) {
        return this.model.aggregate(pipeline);
    }
    async findAll(params) {
        return this.model.find(Object.assign({}, params)).exec();
    }
};
CampaignStatService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(campaign_stat_schema_1.CampaignStat.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], CampaignStatService);
exports.CampaignStatService = CampaignStatService;
//# sourceMappingURL=campaign-stat.service.js.map