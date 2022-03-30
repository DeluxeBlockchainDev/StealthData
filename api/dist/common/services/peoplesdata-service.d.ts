import { HttpService } from '@nestjs/common';
export declare class RequestObject {
    email: string;
}
export declare class PeoplesDataService {
    private httpService;
    static readonly API_KEY = "696562e67afa592419afd1fb82aa6f362605e6026a6cc39bc5ffce7a6236d7a3";
    constructor(httpService: HttpService);
    constructHeader: () => {
        "X-Auth-Token": string;
    };
    createBody: (params: any) => {
        api_key: string;
        company: string[];
        email: string[];
    };
    getData(params: RequestObject): Promise<any>;
}
