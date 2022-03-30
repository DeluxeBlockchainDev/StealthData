"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./services/email.service");
const get_response_service_1 = require("./services/get-response.service");
const peoplesdata_service_1 = require("./services/peoplesdata-service");
const payment_service_1 = require("./services/payment.service");
const stealth_service_1 = require("./services/stealth.service");
let CommonModule = class CommonModule {
};
CommonModule = __decorate([
    common_1.Module({
        imports: [
            common_1.HttpModule,
        ],
        providers: [stealth_service_1.StealthService, get_response_service_1.GetResponseService, peoplesdata_service_1.PeoplesDataService, payment_service_1.PaymentService, email_service_1.EmailService],
        exports: [stealth_service_1.StealthService, get_response_service_1.GetResponseService, peoplesdata_service_1.PeoplesDataService, payment_service_1.PaymentService, email_service_1.EmailService]
    })
], CommonModule);
exports.CommonModule = CommonModule;
//# sourceMappingURL=common.module.js.map