import { CreateClientDto } from 'src/client/dto/client.dto';
export declare class PaymentService {
    constructor();
    payment(req: any): Promise<unknown>;
    CreateCustomer(userInfo: CreateClientDto): Promise<unknown>;
    MakePayment(userInfo: any, inputLineItems: any, amount: any): Promise<unknown>;
    validateForm(req: any): any[];
}
