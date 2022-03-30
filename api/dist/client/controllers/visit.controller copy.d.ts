import { VisitService } from '../services/visit.service';
export declare class VisitController {
    private visitService;
    constructor(visitService: VisitService);
    findAll(offset: string, limit: string, email: string, loginAPIAccessKey: any): Promise<any>;
}
