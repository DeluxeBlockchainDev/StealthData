import { HttpService, Injectable} from '@nestjs/common';

const BASE_URL = 'https://api.peopledatalabs.com/v5/person/enrich';

export class RequestObject { 
	
	email: string

}

@Injectable()
export class PeoplesDataService {

    static readonly API_KEY = "696562e67afa592419afd1fb82aa6f362605e6026a6cc39bc5ffce7a6236d7a3";

    constructor(private httpService: HttpService) {
        
    }

    constructHeader = () => ({
		"X-Auth-Token": `api-key ${PeoplesDataService.API_KEY}`
	})

    createBody = (params) => ({
        "api_key": PeoplesDataService.API_KEY,
        "company": ["Hallspot", "People Data Labs"],
        "email": ["sean.thorne@talentiq.co"]
    })

    async getData (params: RequestObject) {
		try {
			    const response =    await this.httpService.get(
                                        `${BASE_URL}`, 
                                        { 
                                            params: {
                                                "pretty":true,
                                                "api_key": PeoplesDataService.API_KEY,
                                                "email": params.email
                                            },
                                        }
                                    ).toPromise();

			    return response.data;
		} catch (e) {
			//console.log('error response', e.response)
			//throw e;
            return e.response.data
		}
	}

}