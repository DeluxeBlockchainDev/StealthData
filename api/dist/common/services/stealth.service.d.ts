import { HttpService } from '@nestjs/common';
import { ISearchVisitors } from 'src/client/interfaces/visitor.interface';
export declare type Stealth = any;
export declare class CreateAppRequest {
    customerName: string;
    loginUserName: string;
    loginUserPassword: string;
    loginEmail: string;
    loginCompanyName: string;
}
export declare class StealthService {
    private httpService;
    constructor(httpService: HttpService);
    createApp(params: CreateAppRequest): Promise<any>;
    getVisitors(params: ISearchVisitors, apiKey: string): Promise<any[]>;
    toggleTracking(enable: number, apiKey: string): Promise<any[]>;
    getTrackingStatus(apiKey: string): Promise<any[]>;
    moveApp(customerGUID: string): Promise<any[]>;
    getScript(customerGUID: string): Promise<any>;
}
