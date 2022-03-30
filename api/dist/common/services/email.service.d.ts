import { GetResponseService } from "./get-response.service";
export interface IMailParams {
    subject: string;
    from: string;
    to: string;
    name?: string;
    text?: string;
    html?: string;
}
export declare class EmailService {
    private getResponseService;
    constructor(getResponseService: GetResponseService);
    private transporter;
    private createTransporter;
    smtpMail: (params: IMailParams) => Promise<void>;
    getResponseMail: (params: IMailParams) => Promise<void>;
    mail: (params: any, options?: any) => void;
}
