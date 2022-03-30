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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("../../admin/services/admin.service");
const client_service_1 = require("../../client/services/client.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor(adminService, clientService, jwtService) {
        this.adminService = adminService;
        this.clientService = clientService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.clientService.findOneWithPassword({ $or: [{ email }, { username: email }] });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        if (!user) {
            const admin = await this.adminService.findOne(email);
            if (admin && admin.password === pass) {
                const { password } = admin, adminResult = __rest(admin, ["password"]);
                return adminResult;
            }
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, id: user._id, isAdmin: !!user.isAdmin, firstName: user.firstName, companyName: user.companyName };
        common_2.Logger.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        client_service_1.ClientService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map