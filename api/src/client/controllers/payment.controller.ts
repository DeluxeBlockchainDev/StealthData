import { BadRequestException, Body, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { EntryMethod, SecCode } from 'globalpayments-api';
import { EmailService } from 'src/common/services/email.service';
import { PaymentService } from 'src/common/services/payment.service';
import { MakeCheckPaymentDto, MakePaymentDto } from '../dto/payment.dto';
import { InvoiceService } from '../services/invoice.service';
import { SubscriptionService } from '../services/subscription.service';


@Controller('payment')
export class PaymentController {
  
  constructor(
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private invoiceService: InvoiceService,
    private emailService: EmailService,
  ){}

  async raiseInvoice(params:any) {
    const subscription = await this.subscriptionService.findOne({ _id: params.subscriptionId });
    const invoice = {
      billedTo: `${params.firstName}${ params.lastName ? ' ' + params.lastName : ''}`,
      billingAddress: params.billingAddress,
      paymentMethod: !!params.token ? 'credit' : !!params.checkDetails ? 'check' : '',
      ...( !!params.checkDetails ? {...params.checkDetails} : {} ),
      tax: 0,
      amount: params.amount,
      total: params.amount,
      itemName: subscription.name,
      email: params.email,
    }
    const raisedInvoice = await this.invoiceService.create(invoice);
    this.emailService.mail({
      to: params.email,
      from: process.env.SMTP_USERNAME,
      subject: "Payment Receipt",
      html: `
        Hello,<br /><br />
        You have successfully paid $${params.amount} and purchased ${subscription.name} subscription on Stealth Data.
        <br />
        You will be charged $${params.amount} on an ${params.type === 'm' ? 'monthly' : 'annual' } basis.
        <br /><br />
        Stealth Data.
      `
    })
    return raisedInvoice;
  }

  raiseCheckInvoice(params:MakeCheckPaymentDto) {
    return this.raiseInvoice(params);
  }

  raisePaymentInvoice(params:MakePaymentDto) {
    return this.raiseInvoice(params);
  }
  
  @Post()
  async charge(@Body() makePaymentDto: MakePaymentDto) {
    // const { token, amount, type, subscriptionId } = makePaymentDto;
    // try {

    //   if( !this.subscriptionService.checkSubscriptionAmount( subscriptionId, amount, type) ) {
    //     throw new BadRequestException('Amount is invalid!');
    //   }

    //   const payment =  await this.paymentService.makePayment( token, amount );
    //   if( payment.responseCode == '00' ) {
    //     const invoice = await this.raisePaymentInvoice(makePaymentDto);
    //     return { message: 'Payment Successful', success: 1, invoice }
    //   } else {
    //     return { message: payment.responseMessage, success: 0 }
    //   }
    // }catch(e) {
    //   throw new InternalServerErrorException();
    // }
  }

  @Post('/recurring')
  async processRecurringPayment(@Body() makePaymentDto: MakePaymentDto) {
    // const { token, amount, type, subscriptionId } = makePaymentDto;
    // try {

    //     if( !this.subscriptionService.checkSubscriptionAmount( subscriptionId, amount, type) ) {
    //       throw new BadRequestException('Amount is invalid!');
    //     }

    //     const card =  await this.paymentService.getCardByToken(token);
    //     const customer =  await this.paymentService.createCustomer(makePaymentDto);
    //     const recurringPaymentMethod =  await this.paymentService.addPaymentMethod(customer, card);
    //     const payment =  await this.paymentService.processRecurringPayment( recurringPaymentMethod, amount, type );

    //     if( !!payment.key ) {
    //       const invoice = await this.raisePaymentInvoice(makePaymentDto);
    //       return { message: 'Payment Successful.', success: 1, invoice }
    //     } else {
    //       this.raisePaymentInvoice(makePaymentDto);
    //       return { message: 'Payment Failed.', success: 0 }
    //     }
    // }catch(e) {
    //     console.log('e', e)
    //     throw new InternalServerErrorException();
    // }
  }

  @Post('/check')
  async processCheckPayment(@Body() makePaymentDto: MakeCheckPaymentDto) {
    // const { billingAddress, amount, type, subscriptionId, checkDetails, firstName, lastName } = makePaymentDto;
    // try {

    //     if( !this.subscriptionService.checkSubscriptionAmount( subscriptionId, amount, type) ) {
    //       throw new BadRequestException('Amount is invalid!');
    //     }

    //     const check =  await this.paymentService.createCheck({ ...checkDetails, firstName, lastName });
    //     check.entryMode = EntryMethod.Swipe;
    //     check.secCode = SecCode.WEB;

    //     const address =  await this.paymentService.createAddress({ ...billingAddress });
    //     const payment =  await this.paymentService.processCheckPayment( check, amount, address );
    //     if( payment.avsResponseCode == '00' ) {
    //       const invoice = await this.raiseCheckInvoice(makePaymentDto);
    //       return { message: 'Payment Successful.', success: 1, invoice }
    //     } else {
    //       return { message: 'Payment Failed.', success: 0 }
    //     }
    // }catch(e) {
    //     console.log('e', e)
    //     throw new InternalServerErrorException();
    // }
  }

  @Post('/check/recurring')
  async processRecurringCheckPayment(@Body() makePaymentDto: MakeCheckPaymentDto) {
    // const { billingAddress, amount, type, subscriptionId, checkDetails, firstName, lastName } = makePaymentDto;
    // try {

    //     if( !this.subscriptionService.checkSubscriptionAmount( subscriptionId, amount, type) ) {
    //       throw new BadRequestException('Amount is invalid!');
    //     }

    //     const check =  await this.paymentService.createCheck({ ...checkDetails, firstName, lastName });
    //     check.entryMode = EntryMethod.Proximity;
    //     check.secCode = SecCode.WEB;

    //     const customer =  await this.paymentService.createCustomer(makePaymentDto);
    //     const recurringPaymentMethod =  await this.paymentService.addPaymentMethod(customer, check);
    //     const payment =  await this.paymentService.processRecurringPayment( recurringPaymentMethod, amount, type );

    //     if( !!payment.key ) {
    //       const invoice = await this.raiseCheckInvoice(makePaymentDto);
    //       return { message: 'Payment Successful.', success: 1, invoice }
    //     } else {
    //       return { message: 'Payment Failed.', success: 0 }
    //     }
    // }catch(e) {
    //     console.log('e', e)
    //     throw new InternalServerErrorException();
    // }
  }

}