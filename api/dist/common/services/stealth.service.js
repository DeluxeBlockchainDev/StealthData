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
exports.StealthService = exports.CreateAppRequest = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const visitor_interface_1 = require("../../client/interfaces/visitor.interface");
const BASE_URL = "https://api.wlwwid.com/api/v1/";
const API_KEY = "029C4E38-5777-4C08-BFE0-DDD684034508";
const PARENT_APP_DELETED_GUID = "E51E28EF-7FC6-47DF-8366-8F358071DECA";
class CreateAppRequest {
}
exports.CreateAppRequest = CreateAppRequest;
let StealthService = class StealthService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async createApp(params) {
        try {
            const response = await this.httpService.post(`${BASE_URL}createcustomer`, params, { params: { apikey: API_KEY } }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async getVisitors(params, apiKey) {
        if (params.startdate instanceof Date) {
            params.startdate = moment(params.startdate).format('YYYY-MM-DD');
        }
        if (params.enddate instanceof Date) {
            params.enddate = moment(params.enddate).format('YYYY-MM-DD');
        }
        console.log('Stealth Get Visitors Params', params);
        try {
            const response = await this.httpService.get(`${BASE_URL}getvisitiorsbydaterange`, { params: Object.assign(Object.assign({}, params), { apikey: apiKey }) }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async toggleTracking(enable, apiKey) {
        try {
            const response = await this.httpService.post(`${BASE_URL}pixeltrackingsetting`, { enable }, { params: { apikey: apiKey } }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async getTrackingStatus(apiKey) {
        try {
            const response = await this.httpService.get(`${BASE_URL}pixeltrackingsetting`, { params: { apikey: apiKey } }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async moveApp(customerGUID) {
        try {
            const response = await this.httpService.post(`${BASE_URL}movecustomer`, { customerGUID, destinationCustomerGUID: PARENT_APP_DELETED_GUID }, { params: { apikey: API_KEY } }).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
    async getScript(customerGUID) {
        try {
            const response = await this.httpService.get(`http://ndn.statistinamics.com/cstnxtm/${customerGUID}.js`).toPromise();
            return response.data;
        }
        catch (e) {
            console.log('error response', e);
            throw e;
        }
    }
};
StealthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], StealthService);
exports.StealthService = StealthService;
//# sourceMappingURL=stealth.service.js.map