declare class App {
    url: string;
    loginGUID?: string;
    loginAPIAccessKey?: string;
    req?: any;
}
export declare class Address {
    line1: string;
    line2?: string;
    city: string;
    zipcode: string;
    state: string;
    country?: string;
}
export declare class CardInfo {
    name: string;
    cardnumber: string;
    cvv: string;
    expiredate: string;
}
export declare class CreateClientDto {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    subscriptionId: string;
    contactNo: string;
    $addToSet?: any;
    companyName: string;
    description?: string;
    avatar?: string;
    status?: string;
    monthlyVisitorIdentificationAlertCount?: number;
    apps: App[];
    address: Address;
    invoiceId: string;
    cardInfo: CardInfo;
    customerProfileId: string;
    customerPaymentProfileId: string;
}
export declare class UpdateClientDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    password?: string;
    contactNo?: string;
    $addToSet?: any;
    subscriptionId?: string;
    companyName?: string;
    description?: string;
    avatar?: string;
    customerGUID?: string;
    status?: string;
    monthlyVisitorIdentificationAlertCount?: number;
    apps?: App[];
    uniqueVisitorsMonthly?: number;
    address?: Address;
    cardInfo?: CardInfo;
    isAdditionalFee?: boolean;
    customerProfileId?: string;
    customerPaymentProfileId?: string;
    lastBillingDate?: Date;
    isLeadProritySet?: boolean;
}
export declare class ClientSearchParamsDto {
    _id?: any;
    name?: string;
    email?: string;
    companyName?: string;
    contactNo?: string;
    isDeleted?: boolean;
    status?: string;
    isActive?: boolean;
    $or?: any;
}
export {};
