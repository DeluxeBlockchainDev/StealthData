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
exports.LeadPrioritySchema = exports.LeadPriorityData = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoosePaginate = require("mongoose-paginate");
let LeadPriorityData = class LeadPriorityData {
};
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], LeadPriorityData.prototype, "clientId", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], LeadPriorityData.prototype, "loginAPIAccessKey", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", Number)
], LeadPriorityData.prototype, "mild", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", Number)
], LeadPriorityData.prototype, "warm", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", Number)
], LeadPriorityData.prototype, "hot", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], LeadPriorityData.prototype, "createdAt", void 0);
LeadPriorityData = __decorate([
    mongoose_1.Schema()
], LeadPriorityData);
exports.LeadPriorityData = LeadPriorityData;
exports.LeadPrioritySchema = mongoose_1.SchemaFactory.createForClass(LeadPriorityData);
exports.LeadPrioritySchema.plugin(mongoosePaginate);
//# sourceMappingURL=leadpriority.schema.js.map