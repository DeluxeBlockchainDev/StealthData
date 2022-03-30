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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_service_1 = require("../../client/services/client.service");
const email_service_1 = require("../../common/services/email.service");
const jwt_auth_guard_1 = require("../jwt.auth-guard");
const local_auth_guard_1 = require("../local.auth-guard");
const auth_service_1 = require("../services/auth.service");
let AuthController = class AuthController {
    constructor(authService, clientService, jwtService, emailService) {
        this.authService = authService;
        this.clientService = clientService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    getProfile(req) {
        return req.user;
    }
    async forgotPassword(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email is required.');
        }
        const client = await this.clientService.findOne({ email });
        if (!client) {
            throw new common_1.BadRequestException('Client not found.');
        }
        const token = this.jwtService.sign({ _id: client._id }, { expiresIn: '30m' });
        const resetLink = process.env.APP_URL + 'auth/reset-password?token=' + token;
        this.emailService.mail({
            to: email,
            from: process.env.SMTP_USERNAME,
            subject: "Forgot Password",
            html: `
        Hello,<br /><br />
        Click on the below link to recover your password <br /> <br />
        <a href="${resetLink}">${resetLink}</a>
        <br /><br />
        Stealth Data.
      `
        });
        return { success: 1, message: 'Password Reset Email Sent.' };
    }
    async resetPassword(token, password, confirmPassword) {
        if (!token) {
            throw new common_1.BadRequestException('Token is required.');
        }
        if (!password) {
            throw new common_1.BadRequestException('Password is required.');
        }
        if (!confirmPassword) {
            throw new common_1.BadRequestException('Confirm Password is required.');
        }
        if (confirmPassword !== password) {
            throw new common_1.BadRequestException('Confirm Password and Password should be the same.');
        }
        try {
            this.jwtService.verify(token);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid Token.');
        }
        const decoded = this.jwtService.decode(token);
        await this.clientService.findOneAndUpdate({ _id: decoded._id }, { password });
        return { success: 1, message: 'Password Reset successfully.' };
    }
};
__decorate([
    common_1.UseGuards(local_auth_guard_1.LocalAuthGuard),
    common_1.Post('login'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('profile'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    common_1.Post('forgot-password'),
    __param(0, common_1.Body('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    common_1.Post('reset-password'),
    __param(0, common_1.Body('token')), __param(1, common_1.Body('password')), __param(2, common_1.Body('confirmPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        client_service_1.ClientService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map