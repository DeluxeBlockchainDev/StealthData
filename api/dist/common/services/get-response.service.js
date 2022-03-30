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
var GetResponseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetResponseService = void 0;
const common_1 = require("@nestjs/common");
const BASE_URL = "https://api.getresponse.com/v3/";
let GetResponseService = GetResponseService_1 = class GetResponseService {
    constructor(httpService) {
        this.httpService = httpService;
        this.constructHeader = () => ({
            "X-Auth-Token": `api-key ${GetResponseService_1.API_KEY}`,
            "X-domain": "sdemailmarketing.com"
        });
        this.createBody = (params) => (Object.assign(Object.assign(Object.assign({ "name": params.name, "subject": params.subject, "campaignId": params.campaignTypeId, "status": "enabled", "editor": "custom" }, (params.fromField ? {
            fromField: { fromFieldId: params.fromField }
        } : {})), (params.replyTo ? {
            replyTo: { fromFieldId: params.replyTo }
        } : {})), { "content": {
                "html": params.html,
            }, "flags": [
                "openrate", "clicktrack"
            ], "sendSettings": {
                "type": "delay",
                "delayInHours": 6,
                "recurrence": "true",
            }, "triggerSettings": {
                "type": "onday",
                "dayOfCycle": 0,
                "selectedCampaigns": [
                    params.campaignTypeId
                ]
            } }));
    }
    async createAutoResponder(params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}autoresponders`, this.createBody(params), {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('e', e.response.data);
            console.log('error response', e);
            throw e;
        }
    }
    async updateAutoResponder(params, autoresponderId) {
        try {
            const updateObj = Object.assign(Object.assign({}, this.createBody(params)), { content: { html: params.html }, name: params.name, triggerSettings: Object.assign(Object.assign({}, this.createBody(params)['triggerSettings']), { selectedCampaigns: [
                        params.campaignTypeId
                    ] }), status: !!params.isActive ? 'enabled' : 'disabled' });
            const response = await this.httpService.post(`${BASE_URL}autoresponders/${autoresponderId}`, updateObj, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async getAutoResponder(autoresponderId) {
        try {
            const response = await this.httpService.get(`${BASE_URL}autoresponders/${autoresponderId}`, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async getCampaigns(params) {
        try {
            const response = await this.httpService.get(`${BASE_URL}campaigns`, {
                params: Object.assign({}, (!!params && !!params.companyName
                    ? { 'query[name]': params.companyName.replace(/ /g, '').toLowerCase() }
                    : {})),
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async createCampaign(params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}campaigns`, params, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async updateCampaign(id, params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}campaigns/${id}`, params, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async createContact(params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}contacts`, params, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            throw e;
        }
    }
    async deleteContact(contactId) {
        try {
            const response = await this.httpService.delete(`${BASE_URL}contacts/${contactId}`, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            throw e;
        }
    }
    async getContacts(params) {
        try {
            const response = await this.httpService.get(`${BASE_URL}contacts`, {
                params: params,
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            throw e;
        }
    }
    async getFromFields(params) {
        try {
            const response = await this.httpService.get(`${BASE_URL}from-fields`, {
                params: Object.assign(Object.assign({ 'query[email]': params.email }, (!!params.isActive ? { 'query[isActive]': params.isActive } : {})), (!!params.name ? { 'query[name]': params.name } : {})),
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async createFromField(params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}from-fields`, params, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async mail(params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}transactional-emails`, params, {
                params: {},
                headers: this.constructHeader()
            }).toPromise();
            return response.data;
        }
        catch (e) {
            throw e;
        }
    }
};
GetResponseService.API_KEY = "960ku1p1ve6qa0urexdm66lj86xk26r4";
GetResponseService.FROM_FIELDS = {
    "admin@stealthdata.com": "A",
    "no_reply@stealthdata.com": "8"
};
GetResponseService = GetResponseService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], GetResponseService);
exports.GetResponseService = GetResponseService;
//# sourceMappingURL=get-response.service.js.map