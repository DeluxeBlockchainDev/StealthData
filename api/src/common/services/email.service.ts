import * as nodemailer from "nodemailer";
import { Injectable } from "@nestjs/common";
import { GetResponseService } from "./get-response.service";

export interface IMailParams {
    subject: string;
    from: string;
    to: string;
    name?:string;
    text?:string;
    html?:string;
}

@Injectable()
export class EmailService {
	
	constructor(
        private getResponseService: GetResponseService
    ) {
        this.transporter = this.createTransporter({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            username: process.env.SMTP_USERNAME,
            password: process.env.SMTP_PASSWORD
        });
	}
    private transporter:any;

    private createTransporter (params) {
        return nodemailer.createTransport({
            host: params.host,
            port: params.port,
            secure: params.port === 465 ? true: false,
            auth: {
                user: params.username,
                pass: params.password,
            },
        });
    }

    smtpMail = async (params:IMailParams) => {
        const { name, to = '', from = '', subject = '', html = '', text = '' } = params;
      
        try{
          let info = await this.transporter.sendMail({
            from: `${ name ? `"${name}" ` : ``}<${from}>`,
            to,
            subject,
            ...(
                !!html ? { html } : { text }
            )
          });
          console.log("Message sent: %s", info.messageId);
      
        }catch(err){
          console.error(err)
        }
    }

    getResponseMail = async (params:IMailParams) => {
        const { to = '', subject = '', html = '', text = '' } = params;
      
        try{
          let info = await this.getResponseService.mail({
            content: {
                ...(
                    !!html ? { html } : { plain: text }
                )
            },
            recipients: {
                to : {
                    email: to
                }
            },
            fromField: {
                fromFieldId: GetResponseService["FROM_FIELDS"]["no_reply@stealthdata.com"],
            },
            replyTo: {
                fromFieldId: GetResponseService["FROM_FIELDS"]["no_reply@stealthdata.com"],
            },
            subject,
            
          });
          console.log("Message sent:", info);
      
        }catch(err){
          console.error(err)
        }
    }

    mail = (params, options?: any) => {
        const { useSmtp = false } = options || {};
        if(!!useSmtp){
            this.smtpMail(params);
        }
        this.getResponseMail(params);
    }
}
