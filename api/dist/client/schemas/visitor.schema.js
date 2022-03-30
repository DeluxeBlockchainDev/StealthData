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
exports.VisitorSchema = exports.Visitor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoosePaginate = require("mongoose-paginate");
let Visitor = class Visitor {
};
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "loginAPIAccessKey", void 0);
__decorate([
    mongoose_1.Prop({ default: Date }),
    __metadata("design:type", Date)
], Visitor.prototype, "lastVisitedAt", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "customerFlag", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "igIndividualId", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "firstName", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "lastName", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "address", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "city", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "state", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "zipcode", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "phoneNo", void 0);
__decorate([
    mongoose_1.Prop({ default: 'mild' }),
    __metadata("design:type", String)
], Visitor.prototype, "priority", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Visitor.prototype, "autoResponderListName", void 0);
__decorate([
    mongoose_1.Prop({ default: null }),
    __metadata("design:type", Date)
], Visitor.prototype, "autoResponderListDate", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Visitor.prototype, "visitCount", void 0);
__decorate([
    mongoose_1.Prop({ default: null }),
    __metadata("design:type", Date)
], Visitor.prototype, "crmMatchDate", void 0);
__decorate([
    mongoose_1.Prop({ default: null }),
    __metadata("design:type", String)
], Visitor.prototype, "crmMatchId", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], Visitor.prototype, "dateIdentified", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], Visitor.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Visitor.prototype, "isDeleted", void 0);
Visitor = __decorate([
    mongoose_1.Schema()
], Visitor);
exports.Visitor = Visitor;
exports.VisitorSchema = mongoose_1.SchemaFactory.createForClass(Visitor);
exports.VisitorSchema.plugin(mongoosePaginate);
//# sourceMappingURL=visitor.schema.js.map