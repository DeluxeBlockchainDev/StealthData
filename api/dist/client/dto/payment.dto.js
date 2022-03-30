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
exports.MakeCheckPaymentDto = exports.MakePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const client_dto_1 = require("./client.dto");
class CheckDetails {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CheckDetails.prototype, "accountNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CheckDetails.prototype, "routingNumber", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CheckDetails.prototype, "checkType", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], CheckDetails.prototype, "accountType", void 0);
class MakePaymentDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "token", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], MakePaymentDto.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "subscriptionId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsObject(),
    __metadata("design:type", client_dto_1.Address)
], MakePaymentDto.prototype, "billingAddress", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakePaymentDto.prototype, "contactNo", void 0);
exports.MakePaymentDto = MakePaymentDto;
class MakeCheckPaymentDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakeCheckPaymentDto.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakeCheckPaymentDto.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], MakeCheckPaymentDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], MakeCheckPaymentDto.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakeCheckPaymentDto.prototype, "type", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], MakeCheckPaymentDto.prototype, "subscriptionId", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsObject(),
    __metadata("design:type", client_dto_1.Address)
], MakeCheckPaymentDto.prototype, "billingAddress", void 0);
__decorate([
    class_validator_1.IsObject(),
    __metadata("design:type", CheckDetails)
], MakeCheckPaymentDto.prototype, "checkDetails", void 0);
exports.MakeCheckPaymentDto = MakeCheckPaymentDto;
//# sourceMappingURL=payment.dto.js.map