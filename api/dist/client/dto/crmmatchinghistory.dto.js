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
exports.UpdateCrmMatchingHistoryDto = exports.CreateCrmMatchingHistoryDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCrmMatchingHistoryDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateCrmMatchingHistoryDto.prototype, "crmMatched", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateCrmMatchingHistoryDto.prototype, "fileName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateCrmMatchingHistoryDto.prototype, "filePath", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateCrmMatchingHistoryDto.prototype, "matchedEmails", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], CreateCrmMatchingHistoryDto.prototype, "totalRecords", void 0);
__decorate([
    class_validator_1.IsDate(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Date)
], CreateCrmMatchingHistoryDto.prototype, "uploadDate", void 0);
__decorate([
    class_validator_1.IsDate(),
    __metadata("design:type", Boolean)
], CreateCrmMatchingHistoryDto.prototype, "isDeleted", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateCrmMatchingHistoryDto.prototype, "uID", void 0);
exports.CreateCrmMatchingHistoryDto = CreateCrmMatchingHistoryDto;
class UpdateCrmMatchingHistoryDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateCrmMatchingHistoryDto.prototype, "crmMatched", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateCrmMatchingHistoryDto.prototype, "fileName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateCrmMatchingHistoryDto.prototype, "filePath", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateCrmMatchingHistoryDto.prototype, "matchedEmails", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateCrmMatchingHistoryDto.prototype, "totalRecords", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateCrmMatchingHistoryDto.prototype, "uploadDate", void 0);
__decorate([
    class_validator_1.IsDate(),
    __metadata("design:type", Boolean)
], UpdateCrmMatchingHistoryDto.prototype, "isDeleted", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateCrmMatchingHistoryDto.prototype, "uID", void 0);
exports.UpdateCrmMatchingHistoryDto = UpdateCrmMatchingHistoryDto;
//# sourceMappingURL=crmmatchinghistory.dto.js.map