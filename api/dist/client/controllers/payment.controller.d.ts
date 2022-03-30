import { EmailService } from 'src/common/services/email.service';
import { PaymentService } from 'src/common/services/payment.service';
import { MakeCheckPaymentDto, MakePaymentDto } from '../dto/payment.dto';
import { InvoiceService } from '../services/invoice.service';
import { SubscriptionService } from '../services/subscription.service';
export declare class PaymentController {
    private paymentService;
    private subscriptionService;
    private invoiceService;
    private emailService;
    constructor(paymentService: PaymentService, subscriptionService: SubscriptionService, invoiceService: InvoiceService, emailService: EmailService);
    raiseInvoice(params: any): Promise<any>;
    raiseCheckInvoice(params: MakeCheckPaymentDto): Promise<any>;
    raisePaymentInvoice(params: MakePaymentDto): Promise<any>;
    charge(makePaymentDto: MakePaymentDto): Promise<void>;
    processRecurringPayment(makePaymentDto: MakePaymentDto): Promise<void>;
    processCheckPayment(makePaymentDto: MakeCheckPaymentDto): Promise<void>;
    processRecurringCheckPayment(makePaymentDto: MakeCheckPaymentDto): Promise<void>;
}
