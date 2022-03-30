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
exports.UrlTrackingConfigService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const urltrackingconfig_schema_1 = require("../schemas/urltrackingconfig.schema");
let UrlTrackingConfigService = class UrlTrackingConfigService {
    constructor(urlTrackingConfigModel) {
        this.urlTrackingConfigModel = urlTrackingConfigModel;
    }
    async create(createUtcDto) {
        const createdUtc = new this.urlTrackingConfigModel(createUtcDto);
        return createdUtc.save();
    }
    async bulkWrite(paramsArr) {
        return this.urlTrackingConfigModel.bulkWrite(paramsArr);
    }
    async aggregate(pipeline) {
        return this.urlTrackingConfigModel.aggregate(pipeline);
    }
    async findOneAndUpdate(_id, params) {
        return this.urlTrackingConfigModel.findOneAndUpdate({ _id: _id }, params, { useFindAndModify: false }).exec();
    }
    async findAll(params) {
        return this.urlTrackingConfigModel.find(Object.assign({}, params)).exec();
    }
    async fetchAll() {
        return this.urlTrackingConfigModel.find();
    }
    async delete(_id) {
        return this.urlTrackingConfigModel.findOneAndDelete({ _id: _id }).exec();
    }
};
UrlTrackingConfigService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(urltrackingconfig_schema_1.UrlTrackingConfig.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UrlTrackingConfigService);
exports.UrlTrackingConfigService = UrlTrackingConfigService;
//# sourceMappingURL=urltrackingconfig.service.js.map