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
exports.VisitService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const visit_schema_1 = require("../schemas/visit.schema");
let VisitService = class VisitService {
    constructor(visitModel) {
        this.visitModel = visitModel;
    }
    async create(createVisit) {
        const createdVisit = new this.visitModel(createVisit);
        return createdVisit.save();
    }
    async findOneAndUpdate(params, updateVisitParams) {
        return this.visitModel.findOneAndUpdate(params, updateVisitParams).exec();
    }
    async delete(_id) {
        return this.visitModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
    }
    async findOne(params) {
        return this.visitModel.findOne(Object.assign(Object.assign({}, params), { isDeleted: false })).sort({ _id: -1 }).exec();
    }
    async findAll(params, select) {
        return this.visitModel.find(Object.assign(Object.assign({}, params), { isDeleted: false }), !!select ? select : {}).sort({ _id: -1 }).exec();
    }
    async paginate(offset = 0, limit = 10, params) {
        return this.visitModel.paginate(Object.assign(Object.assign({}, params), { isDeleted: false }), { limit, offset, sort: { visitedAt: -1 } });
    }
    async bulkInsert(createVisitArr) {
        return this.visitModel.insertMany(createVisitArr);
    }
    async aggregate(pipeline) {
        return this.visitModel.aggregate(pipeline);
    }
};
VisitService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(visit_schema_1.Visit.name)),
    __metadata("design:paramtypes", [Object])
], VisitService);
exports.VisitService = VisitService;
//# sourceMappingURL=visit.service.js.map