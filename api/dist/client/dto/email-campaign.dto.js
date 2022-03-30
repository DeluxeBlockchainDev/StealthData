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
exports.EmailCampaignSearchParamsDto = exports.UpdateEmailCampaignDto = exports.CreateEmailCampaignDto = void 0;
const class_validator_1 = require("class-validator");
class CreateEmailCampaignDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "html", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "autoResponderId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "fromField", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "replyTo", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "subject", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "campaignTypeId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], CreateEmailCampaignDto.prototype, "editorDesign", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateEmailCampaignDto.prototype, "clientId", void 0);
exports.CreateEmailCampaignDto = CreateEmailCampaignDto;
class UpdateEmailCampaignDto {
}
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "name", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "html", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "autoResponderId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "fromField", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "replyTo", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "subject", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateEmailCampaignDto.prototype, "campaignTypeId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], UpdateEmailCampaignDto.prototype, "editorDesign", void 0);
__decorate([
    class_validator_1.IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateEmailCampaignDto.prototype, "isActive", void 0);
exports.UpdateEmailCampaignDto = UpdateEmailCampaignDto;
class EmailCampaignSearchParamsDto {
}
exports.EmailCampaignSearchParamsDto = EmailCampaignSearchParamsDto;
//# sourceMappingURL=email-campaign.dto.js.map