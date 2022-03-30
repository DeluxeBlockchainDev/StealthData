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
exports.ClientSearchParamsDto = exports.UpdateClientDto = exports.CreateClientDto = exports.CardInfo = exports.Address = void 0;
const class_validator_1 = require("class-validator");
class App {
}
class Address {
}
exports.Address = Address;
class CardInfo {
}
exports.CardInfo = CardInfo;
class CreateClientDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "subscriptionId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "contactNo", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], CreateClientDto.prototype, "$addToSet", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "companyName", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "avatar", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], CreateClientDto.prototype, "monthlyVisitorIdentificationAlertCount", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Array)
], CreateClientDto.prototype, "apps", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", Address)
], CreateClientDto.prototype, "address", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "invoiceId", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", CardInfo)
], CreateClientDto.prototype, "cardInfo", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "customerProfileId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], CreateClientDto.prototype, "customerPaymentProfileId", void 0);
exports.CreateClientDto = CreateClientDto;
class UpdateClientDto {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "contactNo", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Object)
], UpdateClientDto.prototype, "$addToSet", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "subscriptionId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "companyName", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "description", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "avatar", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "customerGUID", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], UpdateClientDto.prototype, "monthlyVisitorIdentificationAlertCount", void 0);
__decorate([
    class_validator_1.IsArray(),
    __metadata("design:type", Array)
], UpdateClientDto.prototype, "apps", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", Address)
], UpdateClientDto.prototype, "address", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", CardInfo)
], UpdateClientDto.prototype, "cardInfo", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", Boolean)
], UpdateClientDto.prototype, "isAdditionalFee", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "customerProfileId", void 0);
__decorate([
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "customerPaymentProfileId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Date)
], UpdateClientDto.prototype, "lastBillingDate", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Boolean)
], UpdateClientDto.prototype, "isLeadProritySet", void 0);
exports.UpdateClientDto = UpdateClientDto;
class ClientSearchParamsDto {
}
exports.ClientSearchParamsDto = ClientSearchParamsDto;
//# sourceMappingURL=client.dto.js.map