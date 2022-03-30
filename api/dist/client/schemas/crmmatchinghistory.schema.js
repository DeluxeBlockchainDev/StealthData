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
exports.CrmMatchingHistorySchema = exports.CrmMatchingHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let CrmMatchingHistory = class CrmMatchingHistory {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CrmMatchingHistory.prototype, "crmMatched", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CrmMatchingHistory.prototype, "fileName", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], CrmMatchingHistory.prototype, "totalRecords", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], CrmMatchingHistory.prototype, "uploadDate", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CrmMatchingHistory.prototype, "filePath", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CrmMatchingHistory.prototype, "matchedEmails", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Boolean)
], CrmMatchingHistory.prototype, "isDeleted", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], CrmMatchingHistory.prototype, "uID", void 0);
CrmMatchingHistory = __decorate([
    mongoose_1.Schema()
], CrmMatchingHistory);
exports.CrmMatchingHistory = CrmMatchingHistory;
exports.CrmMatchingHistorySchema = mongoose_1.SchemaFactory.createForClass(CrmMatchingHistory);
//# sourceMappingURL=crmmatchinghistory.schema.js.map