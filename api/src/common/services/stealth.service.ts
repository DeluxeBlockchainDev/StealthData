import { HttpService, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ISearchVisitors } from 'src/client/interfaces/visitor.interface';

export type Stealth = any;

const BASE_URL = "https://api.wlwwid.com/api/v1/";
const API_KEY = "029C4E38-5777-4C08-BFE0-DDD684034508";
const PARENT_APP_DELETED_GUID = "E51E28EF-7FC6-47DF-8366-8F358071DECA";
export class CreateAppRequest { 
	
	customerName: string

	loginUserName: string

	loginUserPassword: string

	loginEmail: string

	loginCompanyName: string
}

@Injectable()
export class StealthService {
	
	constructor(private httpService: HttpService) {

	}

	async createApp (params: CreateAppRequest) {
		try {
			const response = await this.httpService.post(`${BASE_URL}createcustomer`, params, { params: { apikey: API_KEY }}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}


	/* Accessed using client api key */
	async getVisitors (params:ISearchVisitors, apiKey:string): Promise<any[]> {
		if( params.startdate instanceof Date ) {
			params.startdate = moment(params.startdate).format('YYYY-MM-DD');
		}

		if( params.enddate instanceof Date ) {
			params.enddate = moment(params.enddate).format('YYYY-MM-DD');
		}
		console.log('Stealth Get Visitors Params', params);
		try {
			const response = await this.httpService.get(`${BASE_URL}getvisitiorsbydaterange`, { params: { ...params, ...{ apikey: apiKey } }}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
		
	}

	/* Accessed using client api key */
	async toggleTracking (enable:number, apiKey:string): Promise<any[]> {
		
		try {
			const response = await this.httpService.post(`${BASE_URL}pixeltrackingsetting`, { enable },{ params: { apikey: apiKey }}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
		
	}

	/* Accessed using client api key */
	async getTrackingStatus (apiKey:string): Promise<any[]> {
	
		try {
			const response = await this.httpService.get(`${BASE_URL}pixeltrackingsetting`, { params: { apikey: apiKey }}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
		
	}

	/* Accessed using client api key */
	async moveApp (customerGUID:string): Promise<any[]> {
	
		try {
			const response = await this.httpService.post(
				`${BASE_URL}movecustomer`,
			 	{ customerGUID, destinationCustomerGUID: PARENT_APP_DELETED_GUID },
			 	{ params: { apikey: API_KEY }}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
		
	}

	async getScript(customerGUID:string) {
		try {
			const response = await this.httpService.get(`http://ndn.statistinamics.com/cstnxtm/${customerGUID}.js`).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}
}
