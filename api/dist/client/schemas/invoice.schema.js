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
exports.InvoiceSchema = exports.Invoice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoosePaginate = require("mongoose-paginate");
const client_schema_1 = require("./client.schema");
let Invoice = class Invoice {
};
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Invoice.prototype, "clientId", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", client_schema_1.Address)
], Invoice.prototype, "billingAddress", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Invoice.prototype, "billedTo", void 0);
__decorate([
    mongoose_1.Prop({ enum: ['credit', 'check'] }),
    __metadata("design:type", String)
], Invoice.prototype, "paymentMethod", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Invoice.prototype, "itemName", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Invoice.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "tax", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "amount", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Invoice.prototype, "total", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "isDeleted", void 0);
Invoice = __decorate([
    mongoose_1.Schema()
], Invoice);
exports.Invoice = Invoice;
exports.InvoiceSchema = mongoose_1.SchemaFactory.createForClass(Invoice);
exports.InvoiceSchema.plugin(mongoosePaginate);
//# sourceMappingURL=invoice.schema.js.map