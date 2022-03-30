/// <reference types="mongoose-paginate" />
/// <reference types="mongoose" />
import { StealthService } from 'src/common/services/stealth.service';
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import { ClientService } from '../services/client.service';
import { SubscriptionService } from '../services/subscription.service';
import { GetResponseService } from 'src/common/services/get-response.service';
import { EmailService } from 'src/common/services/email.service';
import { InvoiceService } from '../services/invoice.service';
import { PaymentService } from 'src/common/services/payment.service';
import { CreateLeadPriority } from '../dto/leadpriority.dto';
import { LeadPriorityService } from '../services/leadpriority.service';
export declare class ClientController {
    private clientService;
    private stealthService;
    private subscriptionService;
    private getResponseService;
    private emailService;
    private invoiceService;
    private paymentService;
    private leadPriorityService;
    constructor(clientService: ClientService, stealthService: StealthService, subscriptionService: SubscriptionService, getResponseService: GetResponseService, emailService: EmailService, invoiceService: InvoiceService, paymentService: PaymentService, leadPriorityService: LeadPriorityService);
    syncClientCampaigns(clientParams: any): Promise<void>;
    create(createClientDto: CreateClientDto, file: any): Promise<import("../schemas/client.schema").ClientDocument | UpdateClientDto>;
    findAll(page: string, limit: string): Promise<import("mongoose").PaginateResult<import("../schemas/client.schema").ClientDocument>>;
    accessClientAccount(req: any, id: any): Promise<false | {
        authToken: string;
        user: {
            email: any;
            id: any;
            isAdmin: boolean;
            firstName: any;
        };
        clientData: any;
    }>;
    getInvoices(req: any): Promise<import("../schemas/invoice.schema").InvoiceDocument[]>;
    getInvoice(req: any, id: any): Promise<import("../schemas/invoice.schema").InvoiceDocument>;
    update(_id: string, updateClientDto: UpdateClientDto, file: any): Promise<import("../schemas/client.schema").ClientDocument>;
    toggle(_id: string, status: string | number): Promise<{
        clientStatus: string;
    }>;
    delete(_id: string): Promise<import("../schemas/client.schema").ClientDocument>;
    find(_id: string): Promise<any>;
    checkEmailExists(email: string): Promise<boolean>;
    checkEmailExists2(customerGUID: string): Promise<any>;
    updateLeadPriority(_id: string, CreateLeadPriority: CreateLeadPriority): Promise<import("../schemas/leadpriority.schema").LeadPriorityDocument>;
    getLeadPriority(_id: string, page: string, limit: string, sortField: string, sortOrder: string): Promise<import("mongoose").PaginateResult<import("../schemas/leadpriority.schema").LeadPriorityDocument>>;
}
