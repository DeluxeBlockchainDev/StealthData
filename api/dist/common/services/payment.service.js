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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const globalpayments_api_1 = require("globalpayments-api");
const client_dto_1 = require("../../client/dto/client.dto");
const validator = require('validator');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
let PaymentService = class PaymentService {
    constructor() {
        const config = new globalpayments_api_1.ServicesConfig();
        config.secretApiKey = "skapi_cert_MfFGAgD5CGIA-u9ZkW9jc2nLlWLZQsSp2Wm8qPRiAg";
        config.developerId = "002914";
        config.versionNumber = "4828";
        config.serviceUrl = "https://cert.api2.heartlandportico.com";
        globalpayments_api_1.ServicesContainer.configure(config);
    }
    async payment(req) {
        const validationErrors = this.validateForm(req);
        if (validationErrors.length > 0) {
            return { result: false, error: 'Validation Error.', validationErrors };
        }
        const { cc, cvv, expire, amount } = req;
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
                            resolve({ result: true, success: 'Transaction was successful.' });
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
                                resolve({ result: false, error: 'Transaction failed.' });
                            }
                        }
                    }
                    else {
                        if (response.getTransactionResponse() !== null && response.getTransactionResponse().getErrors() !== null) {
                            let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                            let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                            resolve({
                                result: false,
                                error: `${code}: ${text}`
                            });
                        }
                        else {
                            let code = response.getMessages().getMessage()[0].getCode();
                            let text = response.getMessages().getMessage()[0].getText();
                            resolve({
                                result: false,
                                error: `${code}: ${text}`
                            });
                        }
                    }
                }
                else {
                    resolve({ result: false, error: 'No response.' });
                }
            });
        });
    }
    async CreateCustomer(userInfo) {
        const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(process.env.AUTHORIZE_API_LOGIN_ID);
        merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY);
        var creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber(userInfo.cardInfo.cardnumber);
        creditCard.setExpirationDate(userInfo.cardInfo.expiredate);
        creditCard.setCardCode(userInfo.cardInfo.cvv);
        var paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);
        var customerAddress = new ApiContracts.CustomerAddressType();
        customerAddress.setFirstName(userInfo.firstName);
        customerAddress.setLastName(userInfo.lastName);
        customerAddress.setAddress(userInfo.address.line1);
        customerAddress.setCity(userInfo.address.city);
        customerAddress.setState(userInfo.address.state);
        customerAddress.setZip(userInfo.address.zipcode);
        customerAddress.setCountry(userInfo.address.country);
        customerAddress.setPhoneNumber(userInfo.contactNo);
        var customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
        customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
        customerPaymentProfileType.setPayment(paymentType);
        customerPaymentProfileType.setBillTo(customerAddress);
        var paymentProfilesList = [];
        paymentProfilesList.push(customerPaymentProfileType);
        var customerProfileType = new ApiContracts.CustomerProfileType();
        var tempDate = new Date();
        customerProfileType.setMerchantCustomerId(tempDate.getTime());
        customerProfileType.setDescription(userInfo.description);
        customerProfileType.setEmail(userInfo.email);
        customerProfileType.setPaymentProfiles(paymentProfilesList);
        var createRequest = new ApiContracts.CreateCustomerProfileRequest();
        createRequest.setProfile(customerProfileType);
        createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        var ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());
        return new Promise((resolve, reject) => {
            ctrl.execute(function () {
                var apiResponse = ctrl.getResponse();
                var response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);
                if (response != null) {
                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                        const customerPaymentProfileIdList = response.getCustomerPaymentProfileIdList();
                        resolve({ result: true, customerProfileId: response.getCustomerProfileId(), customerPaymentProfileId: customerPaymentProfileIdList.numericString[0] });
                    }
                    else {
                        console.log('Result Code: ' + response.getMessages().getResultCode());
                        console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                        console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                        resolve({ result: false });
                    }
                }
                else {
                    resolve({ result: false });
                }
            });
        });
    }
    async MakePayment(userInfo, inputLineItems, amount) {
        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(process.env.AUTHORIZE_API_LOGIN_ID);
        merchantAuthenticationType.setTransactionKey(process.env.AUTHORIZE_TRANSACTION_KEY);
        var profileToCharge = new ApiContracts.CustomerProfilePaymentType();
        profileToCharge.setCustomerProfileId(userInfo.customerProfileId);
        var paymentProfile = new ApiContracts.PaymentProfile();
        paymentProfile.setPaymentProfileId(userInfo.customerPaymentProfileId);
        profileToCharge.setPaymentProfile(paymentProfile);
        var orderDetails = new ApiContracts.OrderType();
        var tempDate = new Date();
        orderDetails.setInvoiceNumber('INV-' + tempDate.getTime().toString());
        orderDetails.setDescription('Product Description');
        var lineItemList = [];
        inputLineItems.forEach(element => {
            var lineItem_id = new ApiContracts.LineItemType();
            lineItem_id.setItemId(element.id);
            lineItem_id.setName(element.name);
            lineItem_id.setDescription(element.description);
            lineItem_id.setQuantity(element.quantity);
            lineItem_id.setUnitPrice(element.unitPrice);
            lineItemList.push(lineItem_id);
        });
        var lineItems = new ApiContracts.ArrayOfLineItem();
        lineItems.setLineItem(lineItemList);
        var transactionRequestType = new ApiContracts.TransactionRequestType();
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
        transactionRequestType.setProfile(profileToCharge);
        transactionRequestType.setAmount(amount);
        transactionRequestType.setLineItems(lineItems);
        transactionRequestType.setOrder(orderDetails);
        var createRequest = new ApiContracts.CreateTransactionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setTransactionRequest(transactionRequestType);
        console.log(JSON.stringify(createRequest.getJSON(), null, 2));
        var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
        return new Promise((resolve, reject) => {
            ctrl.execute(function () {
                var apiResponse = ctrl.getResponse();
                var response = new ApiContracts.CreateTransactionResponse(apiResponse);
                console.log(JSON.stringify(response, null, 2));
                if (response != null) {
                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                        if (response.getTransactionResponse().getMessages() != null) {
                            console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                            console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                            console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                            console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                            resolve({ result: true, transactionId: response.getTransactionResponse().getTransId() });
                        }
                        else {
                            console.log('Failed Transaction.');
                            if (response.getTransactionResponse().getErrors() != null) {
                                console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                                console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                            }
                            resolve({ result: false });
                        }
                    }
                    else {
                        console.log('Failed Transaction. ');
                        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                        }
                        else {
                            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                        }
                        resolve({ result: false });
                    }
                }
                else {
                    console.log('Null Response.');
                    resolve({ result: false });
                }
            });
        });
    }
    validateForm(req) {
        const { cc, cvv, expire, amount } = req;
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
        return errors;
    }
};
PaymentService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map