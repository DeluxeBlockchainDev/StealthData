"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer = require("nodemailer");
const common_1 = require("@nestjs/common");
const get_response_service_1 = require("./get-response.service");
let EmailService = class EmailService {
    constructor(getResponseService) {
        this.getResponseService = getResponseService;
        this.smtpMail = async (params) => {
            const { name, to = '', from = '', subject = '', html = '', text = '' } = params;
            try {
                let info = await this.transporter.sendMail(Object.assign({ from: `${name ? `"${name}" ` : ``}<${from}>`, to,
                    subject }, (!!html ? { html } : { text })));
                console.log("Message sent: %s", info.messageId);
            }
            catch (err) {
                console.error(err);
            }
        };
        this.getResponseMail = async (params) => {
            const { to = '', subject = '', html = '', text = '' } = params;
            try {
                let info = await this.getResponseService.mail({
                    content: Object.assign({}, (!!html ? { html } : { plain: text })),
                    recipients: {
                        to: {
                            email: to
                        }
                    },
                    fromField: {
                        fromFieldId: get_response_service_1.GetResponseService["FROM_FIELDS"]["no_reply@stealthdata.com"],
                    },
                    replyTo: {
                        fromFieldId: get_response_service_1.GetResponseService["FROM_FIELDS"]["no_reply@stealthdata.com"],
                    },
                    subject,
                });
                console.log("Message sent:", info);
            }
            catch (err) {
                console.error(err);
            }
        };
        this.mail = (params, options) => {
            const { useSmtp = false } = options || {};
            if (!!useSmtp) {
                this.smtpMail(params);
            }
            this.getResponseMail(params);
        };
        this.transporter = this.createTransporter({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            username: process.env.SMTP_USERNAME,
            password: process.env.SMTP_PASSWORD
        });
    }
    createTransporter(params) {
        return nodemailer.createTransport({
            host: params.host,
            port: params.port,
            secure: params.port === 465 ? true : false,
            auth: {
                user: params.username,
                pass: params.password,
            },
        });
    }
};
EmailService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [get_response_service_1.GetResponseService])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map