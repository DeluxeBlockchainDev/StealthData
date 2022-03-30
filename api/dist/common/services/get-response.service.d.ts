import { HttpService } from '@nestjs/common';
export declare class GetResponseService {
    private httpService;
    static readonly API_KEY = "960ku1p1ve6qa0urexdm66lj86xk26r4";
    static readonly FROM_FIELDS: {
        "admin@stealthdata.com": string;
        "no_reply@stealthdata.com": string;
    };
    constructor(httpService: HttpService);
    constructHeader: () => {
        "X-Auth-Token": string;
        "X-domain": string;
    };
    createBody: (params: any) => {
        content: {
            html: any;
        };
        flags: string[];
        sendSettings: {
            type: string;
            delayInHours: number;
            recurrence: string;
        };
        triggerSettings: {
            type: string;
            dayOfCycle: number;
            selectedCampaigns: any[];
        };
        replyTo?: {
            fromFieldId: any;
        };
        fromField?: {
            fromFieldId: any;
        };
        name: any;
        subject: any;
        campaignId: any;
        status: string;
        editor: string;
    };
    createAutoResponder(params: any): Promise<any>;
    updateAutoResponder(params: any, autoresponderId: any): Promise<any>;
    getAutoResponder(autoresponderId: any): Promise<any>;
    getCampaigns(params?: any): Promise<any>;
    createCampaign(params: any): Promise<any>;
    updateCampaign(id: any, params: any): Promise<any>;
    createContact(params: any): Promise<any>;
    deleteContact(contactId: any): Promise<any>;
    getContacts(params: any): Promise<any>;
    getFromFields(params: any): Promise<any>;
    createFromField(params: any): Promise<any>;
    mail(params: any): Promise<any>;
}
