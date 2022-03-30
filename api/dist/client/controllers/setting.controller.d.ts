import { UrlTrackingConfigService } from '../services/urltrackingconfig.service';
export declare class SettingController {
    private urlTrackingConfigService;
    constructor(urlTrackingConfigService: UrlTrackingConfigService);
    loadTrackingUrls(req: any): Promise<{
        tabledata: import("../schemas/urltrackingconfig.schema").UrlTrackingConfigDocument[];
        status: boolean;
        errors: any[];
    }>;
    filterTrackingURLs(req: any): Promise<{
        tabledata: import("../schemas/urltrackingconfig.schema").UrlTrackingConfigDocument[];
        status: boolean;
        errors: any[];
    }>;
    updateUrlSetting(req: any): Promise<{
        res: import("../schemas/urltrackingconfig.schema").UrlTrackingConfigDocument;
        status: boolean;
        errors: any[];
    }>;
    deleteUrlSetting(req: any, urlId: string): Promise<{
        result: import("../schemas/urltrackingconfig.schema").UrlTrackingConfigDocument;
        status: boolean;
        errors: any[];
    }>;
}
