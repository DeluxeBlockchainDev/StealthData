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
exports.VisitorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const visitor_schema_1 = require("../schemas/visitor.schema");
let VisitorService = class VisitorService {
    constructor(visitorModel) {
        this.visitorModel = visitorModel;
    }
    async create(createVisitor) {
        const createdVisitor = new this.visitorModel(createVisitor);
        return createdVisitor.save();
    }
    async findOneAndUpdate(params, updateVisitorParams) {
        return this.visitorModel.findOneAndUpdate(params, updateVisitorParams).exec();
    }
    async delete(_id) {
        return this.visitorModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
    }
    async remove(query) {
        return this.visitorModel.remove(Object.assign({}, query)).exec();
    }
    async findOne(params) {
        return this.visitorModel.findOne(Object.assign(Object.assign({}, params), { isDeleted: false }), { lean: true }).sort({ _id: -1 }).exec();
    }
    async findAll(params, selectParams, limit, skip) {
        const query = this.visitorModel.find(Object.assign(Object.assign({}, params), { isDeleted: false }), Object.assign({}, (selectParams ? Object.assign({}, selectParams) : {}))).sort({ _id: -1 });
        if (limit !== null && limit !== undefined) {
            query.limit(limit);
        }
        if (skip !== null && skip !== undefined) {
            query.skip(skip);
        }
        return query.exec();
    }
    async count(params) {
        return this.visitorModel.find(Object.assign(Object.assign({}, params), { isDeleted: false })).sort({ _id: -1 }).countDocuments().exec();
    }
    async paginate(page = 1, limit = 10, params, sort) {
        return this.visitorModel.paginate(Object.assign(Object.assign({}, params), { isDeleted: false }), { limit, page, sort: Object.assign({}, (!!sort ? { [sort.field]: sort.order } : { lastVisitedAt: -1 })) });
    }
    async bulkInsert(createVisitorArr) {
        return this.visitorModel.insertMany(createVisitorArr);
    }
    async bulkWrite(paramsArr) {
        return this.visitorModel.bulkWrite(paramsArr);
    }
    async aggregate(pipeline) {
        return this.visitorModel.aggregate(pipeline);
    }
    async updateMany(params, updateVisitorParams) {
        return this.visitorModel.updateMany(params, updateVisitorParams).exec();
    }
};
VisitorService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(visitor_schema_1.Visitor.name)),
    __metadata("design:paramtypes", [Object])
], VisitorService);
exports.VisitorService = VisitorService;
//# sourceMappingURL=visitor.service.js.map