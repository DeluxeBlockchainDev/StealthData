import { UrlTrackingConfigService } from '../services/urltrackingconfig.service';
export declare class SettingController {
    private urlTrackingConfigService;
    constructor(urlTrackingConfigService: UrlTrackingConfigService);
    loadTrackingUrls(req: any): Promise<{
        tabledata: import("../schemas/urltrackingconfig.schema").UrlTrackingConfigDocument[];
        status: boolean;
        errors: any[];
    }>;
    updateUrlSetting(id: string, newUrl: string, req: any): Promise<{
        tabledata: import("../schemas/urltrackingconfig.schema").UrlTrackingConfigDocument[];
        status: boolean;
        errors: any[];
    }>;
}
