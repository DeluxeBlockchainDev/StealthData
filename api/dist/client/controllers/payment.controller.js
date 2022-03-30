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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("../../common/services/email.service");
const payment_service_1 = require("../../common/services/payment.service");
const payment_dto_1 = require("../dto/payment.dto");
const invoice_service_1 = require("../services/invoice.service");
const subscription_service_1 = require("../services/subscription.service");
let PaymentController = class PaymentController {
    constructor(paymentService, subscriptionService, invoiceService, emailService) {
        this.paymentService = paymentService;
        this.subscriptionService = subscriptionService;
        this.invoiceService = invoiceService;
        this.emailService = emailService;
    }
    async raiseInvoice(params) {
        const subscription = await this.subscriptionService.findOne({ _id: params.subscriptionId });
        const invoice = Object.assign(Object.assign({ billedTo: `${params.firstName}${params.lastName ? ' ' + params.lastName : ''}`, billingAddress: params.billingAddress, paymentMethod: !!params.token ? 'credit' : !!params.checkDetails ? 'check' : '' }, (!!params.checkDetails ? Object.assign({}, params.checkDetails) : {})), { tax: 0, amount: params.amount, total: params.amount, itemName: subscription.name, email: params.email });
        const raisedInvoice = await this.invoiceService.create(invoice);
        this.emailService.mail({
            to: params.email,
            from: process.env.SMTP_USERNAME,
            subject: "Payment Receipt",
            html: `
        Hello,<br /><br />
        You have successfully paid $${params.amount} and purchased ${subscription.name} subscription on Stealth Data.
        <br />
        You will be charged $${params.amount} on an ${params.type === 'm' ? 'monthly' : 'annual'} basis.
        <br /><br />
        Stealth Data.
      `
        });
        return raisedInvoice;
    }
    raiseCheckInvoice(params) {
        return this.raiseInvoice(params);
    }
    raisePaymentInvoice(params) {
        return this.raiseInvoice(params);
    }
    async charge(makePaymentDto) {
    }
    async processRecurringPayment(makePaymentDto) {
    }
    async processCheckPayment(makePaymentDto) {
    }
    async processRecurringCheckPayment(makePaymentDto) {
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.MakePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "charge", null);
__decorate([
    common_1.Post('/recurring'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.MakePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "processRecurringPayment", null);
__decorate([
    common_1.Post('/check'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.MakeCheckPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "processCheckPayment", null);
__decorate([
    common_1.Post('/check/recurring'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.MakeCheckPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "processRecurringCheckPayment", null);
PaymentController = __decorate([
    common_1.Controller('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        subscription_service_1.SubscriptionService,
        invoice_service_1.InvoiceService,
        email_service_1.EmailService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map