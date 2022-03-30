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
exports.InvoiceService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const invoice_schema_1 = require("../schemas/invoice.schema");
let InvoiceService = class InvoiceService {
    constructor(invoiceModel) {
        this.invoiceModel = invoiceModel;
    }
    async create(params) {
        const createdVisitor = new this.invoiceModel(params);
        return createdVisitor.save();
    }
    async findOneAndUpdate(searchParams, updateParams) {
        return this.invoiceModel.findOneAndUpdate(searchParams, updateParams).exec();
    }
    async delete(_id) {
        return this.invoiceModel.findOneAndUpdate({ _id }, { isDeleted: true }).exec();
    }
    async findOne(params) {
        return this.invoiceModel.findOne(Object.assign(Object.assign({}, params), { isDeleted: false })).sort({ _id: -1 }).exec();
    }
    async findAll(params, selectParams) {
        return this.invoiceModel.find(Object.assign(Object.assign({}, params), { isDeleted: false }), Object.assign({}, (selectParams ? Object.assign({}, selectParams) : {}))).sort({ _id: -1 }).exec();
    }
};
InvoiceService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], InvoiceService);
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoice.service.js.map