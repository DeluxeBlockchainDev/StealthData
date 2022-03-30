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
exports.VisitController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const visit_service_1 = require("../services/visit.service");
let VisitController = class VisitController {
    constructor(visitService) {
        this.visitService = visitService;
    }
    async findAll(offset, limit, email, pageUrl, loginAPIAccessKey) {
        const visits = await this.visitService.paginate(parseInt(offset), parseInt(limit), Object.assign(Object.assign(Object.assign({}, (loginAPIAccessKey ? { loginAPIAccessKey } : {})), (email ? { email } : {})), (pageUrl ? { pageUrl: { $regex: new RegExp(pageUrl, "i") } } : {})));
        return visits;
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('offset')), __param(1, common_1.Query('limit')), __param(2, common_1.Query('email')), __param(3, common_1.Query('pageUrl')), __param(4, common_1.Query('loginAPIAccessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "findAll", null);
VisitController = __decorate([
    common_1.Controller('visit'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [visit_service_1.VisitService])
], VisitController);
exports.VisitController = VisitController;
//# sourceMappingURL=visit.controller.js.map