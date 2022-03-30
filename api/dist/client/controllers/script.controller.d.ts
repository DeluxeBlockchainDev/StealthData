import { StealthService } from 'src/common/services/stealth.service';
export declare class ScriptController {
    private stealthService;
    constructor(stealthService: StealthService);
    checkEmailExists2(customerGUID: string): Promise<any>;
}
