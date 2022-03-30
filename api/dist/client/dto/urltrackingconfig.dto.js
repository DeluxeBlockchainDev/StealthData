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
exports.UpdateUrlTrackingConfigDto = exports.CreateUrlTrackingConfigDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUrlTrackingConfigDto {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUrlTrackingConfigDto.prototype, "url", void 0);
__decorate([
    class_validator_1.IsDate(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Date)
], CreateUrlTrackingConfigDto.prototype, "createdAt", void 0);
__decorate([
    class_validator_1.IsDate(),
    __metadata("design:type", Boolean)
], CreateUrlTrackingConfigDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], CreateUrlTrackingConfigDto.prototype, "uId", void 0);
exports.CreateUrlTrackingConfigDto = CreateUrlTrackingConfigDto;
class UpdateUrlTrackingConfigDto {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateUrlTrackingConfigDto.prototype, "url", void 0);
__decorate([
    class_validator_1.IsDate(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Date)
], UpdateUrlTrackingConfigDto.prototype, "createdAt", void 0);
__decorate([
    class_validator_1.IsDate(),
    __metadata("design:type", Boolean)
], UpdateUrlTrackingConfigDto.prototype, "status", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], UpdateUrlTrackingConfigDto.prototype, "uId", void 0);
exports.UpdateUrlTrackingConfigDto = UpdateUrlTrackingConfigDto;
//# sourceMappingURL=urltrackingconfig.dto.js.map