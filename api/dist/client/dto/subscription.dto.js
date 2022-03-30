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
exports.SubscriptionSearchParamsDto = exports.UpdateSubscriptionDto = exports.CreateSubscriptionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSubscriptionDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "uniqueVisitorsMonthlyLimit", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isHotPriorityAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isDashboardAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isEmailCampaignsAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isCrmMatchingAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isVisits", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isUrlsViewed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isLeadPriority", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isCrmMatched", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isDashboardCrmMatched", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isMonthlyLeadPriority", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isMonthlyEmailStats", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isTop5Urls", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isTopVisitors", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isAccessToCorporate", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isAdvancedXLSXExport", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "customUrlTracking", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "customLeadPriority", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "price", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "annualDiscount", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isActive", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "html", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "listOrder", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "additionalFee", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], CreateSubscriptionDto.prototype, "isCustomPackage", void 0);
exports.CreateSubscriptionDto = CreateSubscriptionDto;
class UpdateSubscriptionDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "uniqueVisitorsMonthlyLimit", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isHotPriorityAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isEmailCampaignsAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isDashboardAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isCrmMatchingAllowed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isVisits", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isUrlsViewed", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isLeadPriority", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isCrmMatched", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isDashboardCrmMatched", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isMonthlyLeadPriority", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isMonthlyEmailStats", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isTop5Urls", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isTopVisitors", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isAccessToCorporate", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isAdvancedXLSXExport", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "customUrlTracking", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "customLeadPriority", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "price", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "annualDiscount", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isActive", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "html", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "listOrder", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "additionalFee", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "isCustomPackage", void 0);
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
class SubscriptionSearchParamsDto {
}
exports.SubscriptionSearchParamsDto = SubscriptionSearchParamsDto;
//# sourceMappingURL=subscription.dto.js.map