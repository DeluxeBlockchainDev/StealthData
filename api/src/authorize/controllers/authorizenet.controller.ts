import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StealthService, CreateAppRequest } from 'src/common/services/stealth.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import * as bcrypt from 'bcrypt';
import * as flatten from 'lodash.flatten';

const validator = require('validator');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;

const DEFAULT_USERNAME = 'stealth-user-'
const DEFAULT_PASSWORD = 'stealth-password-'

@Controller('authorizenet')
export class AuthorizeNetController {
  
  constructor(
    
  ){}

  @Get('/payment')
  async payment(@Request() req) {
    const validationErrors = this.validateForm(req);

    if(validationErrors.length > 0) {
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
        if(response !== null) {
            if(response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
                if(response.getTransactionResponse().getMessages() !== null) {
                    resolve({ success: 'Transaction was successful.' });
                } else {
                    if(response.getTransactionResponse().getErrors() !== null) {
                        let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                        let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                        resolve( {
                            error: `${code}: ${text}`
                        });
                    } else {
                        resolve( { error: 'Transaction failed.' });
                    }
                }    
            } else {
                if(response.getTransactionResponse() !== null && response.getTransactionResponse().getErrors() !== null){
                    let code = response.getTransactionResponse().getErrors().getError()[0].getErrorCode();
                    let text = response.getTransactionResponse().getErrors().getError()[0].getErrorText();
                    resolve( {
                        error: `${code}: ${text}`
                    });
                } else {
                    let code = response.getMessages().getMessage()[0].getCode();
                    let text = response.getMessages().getMessage()[0].getText();
                    resolve( {
                        error: `${code}: ${text}`
                    });
                }   
            }    
  
        } else {
          resolve({ error: 'No response.' });
        }
      });
    });
    
  }

  validateForm(req) {
    const { cc, cvv, expire, amount } = req.body;

    const errors = [];

    if(!validator.isCreditCard(cc)) {
        errors.push({
            param: 'cc',
            msg: 'Invalid credit card number.'
        });
    }

    if(!/^\d{3}$/.test(cvv)) {
        errors.push({
            param: 'cvv',
            msg: 'Invalid CVV code.'
        });
    }

    if(!/^\d{4}$/.test(expire)) {
        errors.push({
            param: 'expire',
            msg: 'Invalid expiration date.'
        }); 
    }

    if(!validator.isDecimal(amount)) {
        errors.push({
            param: 'amount',
            msg: 'Invalid amount.'
        }); 
    }

    return errors;
  }
}