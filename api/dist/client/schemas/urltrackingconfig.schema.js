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
exports.UrlTrackingConfigSchema = exports.UrlTrackingConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let UrlTrackingConfig = class UrlTrackingConfig {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], UrlTrackingConfig.prototype, "url", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], UrlTrackingConfig.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ default: 1 }),
    __metadata("design:type", Boolean)
], UrlTrackingConfig.prototype, "status", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], UrlTrackingConfig.prototype, "uId", void 0);
UrlTrackingConfig = __decorate([
    mongoose_1.Schema()
], UrlTrackingConfig);
exports.UrlTrackingConfig = UrlTrackingConfig;
exports.UrlTrackingConfigSchema = mongoose_1.SchemaFactory.createForClass(UrlTrackingConfig);
//# sourceMappingURL=urltrackingconfig.schema.js.map