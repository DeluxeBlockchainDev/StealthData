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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const urltrackingconfig_service_1 = require("../services/urltrackingconfig.service");
let SettingController = class SettingController {
    constructor(urlTrackingConfigService) {
        this.urlTrackingConfigService = urlTrackingConfigService;
    }
    async loadTrackingUrls(req) {
        let errors = [];
        try {
            const tabledata = await this.urlTrackingConfigService.findAll({ uID: req.user.id });
            return {
                tabledata,
                status: !errors.length,
                errors
            };
        }
        catch (err) {
            console.log('ERROR', `urlTrackingConfig`, err);
            throw new common_1.InternalServerErrorException('Internal Server Error');
        }
    }
    async updateUrlSetting(id, newUrl, req) {
        common_1.Logger.log(req.user);
        common_1.Logger.log(id);
        common_1.Logger.log(newUrl);
        let errors = [];
        try {
            const tabledata = await this.urlTrackingConfigService.findAll({ uID: req.user.id });
            return {
                tabledata,
                status: !errors.length,
                errors
            };
        }
        catch (err) {
            console.log('ERROR', `urlTrackingConfig`, err);
            throw new common_1.InternalServerErrorException('Internal Server Error');
        }
    }
};
__decorate([
    common_1.Post('/loadTrackingUrls'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "loadTrackingUrls", null);
__decorate([
    common_1.Post('/updateUrlSetting'),
    __param(0, common_1.Query('id')),
    __param(1, common_1.Query('newUrl')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "updateUrlSetting", null);
SettingController = __decorate([
    common_1.Controller('setting'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [urltrackingconfig_service_1.UrlTrackingConfigService])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller%20-%20Copy.js.map