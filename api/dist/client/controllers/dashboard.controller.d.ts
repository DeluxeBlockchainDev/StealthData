import { VisitService } from '../services/visit.service';
import { VisitorService } from '../services/visitor.service';
import { CampaignStatService } from '../services/campaign-stat.service';
import { UnsubscribedUserService } from '../services/unsubscribed-user.service';
import { ClientService } from '../services/client.service';
export declare class DashboardController {
    private visitService;
    private visitorService;
    private campaignStatService;
    private unsubscribedUserService;
    private clientService;
    constructor(visitService: VisitService, visitorService: VisitorService, campaignStatService: CampaignStatService, unsubscribedUserService: UnsubscribedUserService, clientService: ClientService);
    getTopVisitors(filters: any, loginAPIAccessKey: any): Promise<any>;
    processFileManual({ stream, fileName, clientMap, destDir, crDate }: {
        stream: any;
        fileName: any;
        clientMap: any;
        destDir: any;
        crDate: any;
    }, onDownload: any): void;
    test(dateString: any): Promise<void>;
    getLeadPriority(loginAPIAccessKey: any): Promise<any>;
    getVisitorStats(loginAPIAccessKey: any): Promise<{
        totalVisitorsIdentified: number;
        totalVisitors: number;
        dailyVisitorData: any[];
        totalCrmMatched: number;
    }>;
    getTopUrls(filters: any, loginAPIAccessKey: any): Promise<any>;
    getEmailStats(req: any): Promise<any>;
}
