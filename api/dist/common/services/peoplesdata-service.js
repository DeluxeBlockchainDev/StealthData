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
var PeoplesDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeoplesDataService = exports.RequestObject = void 0;
const common_1 = require("@nestjs/common");
const BASE_URL = 'https://api.peopledatalabs.com/v5/person/enrich';
class RequestObject {
}
exports.RequestObject = RequestObject;
let PeoplesDataService = PeoplesDataService_1 = class PeoplesDataService {
    constructor(httpService) {
        this.httpService = httpService;
        this.constructHeader = () => ({
            "X-Auth-Token": `api-key ${PeoplesDataService_1.API_KEY}`
        });
        this.createBody = (params) => ({
            "api_key": PeoplesDataService_1.API_KEY,
            "company": ["Hallspot", "People Data Labs"],
            "email": ["sean.thorne@talentiq.co"]
        });
    }
    async getData(params) {
        try {
            const response = await this.httpService.get(`${BASE_URL}`, {
                params: {
                    "pretty": true,
                    "api_key": PeoplesDataService_1.API_KEY,
                    "email": params.email
                },
            }).toPromise();
            return response.data;
        }
        catch (e) {
            return e.response.data;
        }
    }
};
PeoplesDataService.API_KEY = "696562e67afa592419afd1fb82aa6f362605e6026a6cc39bc5ffce7a6236d7a3";
PeoplesDataService = PeoplesDataService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], PeoplesDataService);
exports.PeoplesDataService = PeoplesDataService;
//# sourceMappingURL=peoplesdata-service.js.map