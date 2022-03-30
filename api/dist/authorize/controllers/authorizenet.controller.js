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
exports.AuthorizeNetController = void 0;
const common_1 = require("@nestjs/common");
const stealth_service_1 = require("../../common/services/stealth.service");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const validator = require('validator');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const DEFAULT_USERNAME = 'stealth-user-';
const DEFAULT_PASSWORD = 'stealth-password-';
let AuthorizeNetController = class AuthorizeNetController {
    constructor() { }
    async payment(req) {
        const validationErrors = this.validateForm(req);
        if (validationErrors.length > 0) {
            return validationErrors;
        }
        const { cc, cvv, expire, amount } = req.body;
        const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(process.env.AUTHORIZE_API_LOGIN_ID);
        merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY);
        const creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(cc);
        creditCard.setExpirationDate(expire);
        creditCard.setCardCode(cvv);
        const paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);
        const transactionSetting = new ApiContracts.SettingType();
        transactionSetting.setSettingName('recurringBilling');
        transactionSetting.setSettingValue('false');
        const transactionSettingList = [];
        transactionSettingList.push(transactionSetting);
        const transactionSettings = new ApiContracts.ArrayOfSetting();
        transactionSettings.setSetting(transactionSettingList);
        const transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setPayment(paymentType);
        transactionRequestType.setAmount(amount);
        transactionRequestType.setTransactionSettings(transactionSettings);
        const createRequest = new ApiContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);
        const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
        return new Promise((resolve, reject) => {
            ctrl.execute(() => {
                const apiResponse = ctrl.getResponse();
                const response = new ApiContracts.CreateTransactionResponse(apiResponse);
                if (response !== null) {
                    if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
                        if (response.getTransactionResponse().getMessages() !== null) {
                            resolve({ success: 'Transaction was successful.' });
                        }
                        else {
                            if (response.getTransactionResponse().getErrors() !== null) {
                                let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                                let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                                resolve({
                                    error: `${code}: ${text}`
                                });
                            }
                            else {
                                resolve({ error: 'Transaction failed.' });
                            }
                        }
                    }
                    else {
                        if (response.getTransactionResponse() !== null && response.getTransactionResponse().getErrors() !== null) {
                            let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                            let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                            resolve({
                                error: `${code}: ${text}`
                            });
                        }
                        else {
                            let code = response.getMessages().getMessage()[0].getCode();
                            let text = response.getMessages().getMessage()[0].getText();
                            resolve({
                                error: `${code}: ${text}`
                            });
                        }
                    }
                }
                else {
                    resolve({ error: 'No response.' });
                }
            });
        });
    }
    validateForm(req) {
        const { cc, cvv, expire, amount } = req.body;
        const errors = [];
        if (!validator.isCreditCard(cc)) {
            errors.push({
                param: 'cc',
                msg: 'Invalid credit card number.'
            });
        }
        if (!/^\d{3}$/.test(cvv)) {
            errors.push({
                param: 'cvv',
                msg: 'Invalid CVV code.'
            });
        }
        if (!/^\d{4}$/.test(expire)) {
            errors.push({
                param: 'expire',
                msg: 'Invalid expiration date.'
            });
        }
        if (!validator.isDecimal(amount)) {
            errors.push({
                param: 'amount',
                msg: 'Invalid amount.'
            });
        }
        return errors;
    }
};
__decorate([
    common_1.Get('/payment'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthorizeNetController.prototype, "payment", null);
AuthorizeNetController = __decorate([
    common_1.Controller('authorizenet'),
    __metadata("design:paramtypes", [])
], AuthorizeNetController);
exports.AuthorizeNetController = AuthorizeNetController;
//# sourceMappingURL=authorizenet.controller.js.map