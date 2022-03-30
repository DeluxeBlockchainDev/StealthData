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
exports.CorporateService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const corporate_schema_1 = require("../schemas/corporate.schema");
let CorporateService = class CorporateService {
    constructor(corporateModel) {
        this.corporateModel = corporateModel;
    }
    async create(createCorporate) {
        const createdCorporate = new this.corporateModel(createCorporate);
        return createdCorporate.save();
    }
    async findAll(params, selectParams, limit, skip) {
        const query = this.corporateModel.find(Object.assign(Object.assign({}, params), { isDeleted: false }), Object.assign({}, (selectParams ? Object.assign({}, selectParams) : {}))).sort({ _id: -1 });
        if (limit !== null && limit !== undefined) {
            query.limit(limit);
        }
        if (skip !== null && skip !== undefined) {
            query.skip(skip);
        }
        return query.exec();
    }
    async bulkWrite(paramsArr) {
        return this.corporateModel.bulkWrite(paramsArr);
    }
};
CorporateService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(corporate_schema_1.CorporateData.name)),
    __metadata("design:paramtypes", [Object])
], CorporateService);
exports.CorporateService = CorporateService;
//# sourceMappingURL=corporate.service.js.map