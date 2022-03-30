"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeNetModule = void 0;
const common_1 = require("@nestjs/common");
const authorizenet_controller_1 = require("./controllers/authorizenet.controller");
let AuthorizeNetModule = class AuthorizeNetModule {
};
AuthorizeNetModule = __decorate([
    common_1.Module({
        imports: [],
        controllers: [authorizenet_controller_1.AuthorizeNetController],
        providers: [],
        exports: []
    })
], AuthorizeNetModule);
exports.AuthorizeNetModule = AuthorizeNetModule;
//# sourceMappingURL=authorize.module.js.map