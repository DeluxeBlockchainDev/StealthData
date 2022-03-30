import { HttpService, Injectable } from '@nestjs/common';


const BASE_URL = "https://api.getresponse.com/v3/";
@Injectable()
export class GetResponseService {

	static readonly API_KEY = "960ku1p1ve6qa0urexdm66lj86xk26r4";
	static readonly FROM_FIELDS = {
		"admin@stealthdata.com" : "A",
		"no_reply@stealthdata.com": "8"
	}
	constructor(private httpService: HttpService) {

	}

	constructHeader = () => ({
		"X-Auth-Token": `api-key ${GetResponseService.API_KEY}`,
		"X-domain": "sdemailmarketing.com"
	})

	createBody = (params) => ({
		"name": params.name,
		"subject": params.subject,
		"campaignId": params.campaignTypeId,
		"status": "enabled",
		"editor": "custom",
		...( params.fromField ? { 
			fromField : { fromFieldId: params.fromField }
		} : {} ),
		...( params.replyTo ? { 
			replyTo : { fromFieldId: params.replyTo }
		} : {} ),
		"content": {
			"html": params.html,
		},
		"flags": [
			"openrate", "clicktrack"
		],
		"sendSettings": {
			"type": "delay",
			"delayInHours": 6,
			"recurrence": "true",
			// "type": "signup",
			// "timeTravel": "true",
		},
		"triggerSettings": {
			"type": "onday",
			"dayOfCycle": 0,
			"selectedCampaigns": [
				params.campaignTypeId
			]
		}
	})

	// Auto Responder
	async createAutoResponder (params: any) {
		try {
			const response = await this.httpService.post(
				`${BASE_URL}autoresponders`, 
				this.createBody(params), { 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('e', e.response.data);
			console.log('error response', e)
			throw e;
		}
	}


	async updateAutoResponder (params: any, autoresponderId:any) {
		try {
			
			const updateObj  = {
				...this.createBody(params),
				content: { html: params.html },  
				name: params.name,
				triggerSettings: {
					...this.createBody(params)['triggerSettings'],
					selectedCampaigns: [
						params.campaignTypeId
					]	
				},
				status: !!params.isActive ? 'enabled' : 'disabled'
			}
			const response = await this.httpService.post(
				`${BASE_URL}autoresponders/${autoresponderId}`, 
				updateObj, { 
					params: {}, 
					headers: this.constructHeader()
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	async getAutoResponder (autoresponderId:any) {
		
		try {
			const response = await this.httpService.get(
				`${BASE_URL}autoresponders/${autoresponderId}`, 
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	// Campaigns
	async getCampaigns (params?:any) {
		try {
			const response = await this.httpService.get(
				`${BASE_URL}campaigns`, 
				{ 
					params: {
						...(
							!!params && !!params.companyName
							? { 'query[name]': params.companyName.replace(/ /g,'').toLowerCase() }
							: {}
						)
					}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	async createCampaign (params:any) {
		try {
			const response = await this.httpService.post(
				`${BASE_URL}campaigns`, 
				params,
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	async updateCampaign ( id, params:any ) {
		try {
			const response = await this.httpService.post(
				`${BASE_URL}campaigns/${id}`, 
				params,
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	// Contacts
	async createContact (params) {
		try {
			const response = await this.httpService.post(
				`${BASE_URL}contacts`, 
				params,
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			throw e;
		}
	}

	async deleteContact (contactId) {
		try {
			const response = await this.httpService.delete(
				`${BASE_URL}contacts/${contactId}`, 
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			throw e;
		}
	}

	async getContacts (params) {
		try {
			const response = await this.httpService.get(
				`${BASE_URL}contacts`, 
				{ 
					params: params, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			throw e;
		}
	}


	// From Fields
	async getFromFields (params:any) {
		try {
			const response = await this.httpService.get(
				`${BASE_URL}from-fields`, 
				{ 
					params: {
						'query[email]': params.email,
						...(
							!!params.isActive ? { 'query[isActive]': params.isActive } : {}
						),
						...(
							!!params.name ? { 'query[name]': params.name } : {}
						)
					}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	async createFromField (params:any) {
		try {
			const response = await this.httpService.post(
				`${BASE_URL}from-fields`, 
				params,
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			console.log('error response', e)
			throw e;
		}
	}

	//mail
	async mail (params) {
		try {
			const response = await this.httpService.post(
				`${BASE_URL}transactional-emails`,
				params,
				{ 
					params: {}, 
					headers: this.constructHeader() 
				}).toPromise();
			return response.data;
		} catch (e) {
			throw e;
		}
	}
}
