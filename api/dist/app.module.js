"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const client_module_1 = require("./client/client.module");
const admin_module_1 = require("./admin/admin.module");
const common_module_1 = require("./common/common.module");
const app_controller_1 = require("./app.controller");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const authorize_module_1 = require("./authorize/authorize.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://localhost/stealth-app', Object.assign({}, (process.env.DB_PASSWORD && process.env.DB_USERNAME
                ?
                    {
                        pass: process.env.DB_PASSWORD,
                        user: process.env.DB_USERNAME
                    }
                : {}))),
            auth_module_1.AuthModule,
            client_module_1.ClientModule,
            authorize_module_1.AuthorizeNetModule,
            admin_module_1.AdminModule,
            common_module_1.CommonModule,
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot()
        ],
        controllers: [app_controller_1.AppController]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map