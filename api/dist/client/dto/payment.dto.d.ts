import { Address } from './client.dto';
declare class CheckDetails {
    accountNumber: string;
    routingNumber: string;
    checkType: string;
    accountType: string;
}
export declare class MakePaymentDto {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
    amount: number;
    type: string;
    subscriptionId: string;
    billingAddress: Address;
    contactNo: string;
}
export declare class MakeCheckPaymentDto {
    firstName: string;
    lastName: string;
    email: string;
    amount: number;
    type: string;
    subscriptionId: string;
    billingAddress: Address;
    checkDetails: CheckDetails;
}
export {};
