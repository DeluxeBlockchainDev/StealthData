/// <reference types="mongoose-paginate" />
import { TasksService } from '../services/tasks.service';
import { VisitService } from '../services/visit.service';
import { VisitorService } from '../services/visitor.service';
import { ClientService } from '../services/client.service';
import { LeadPriorityService } from '../services/leadpriority.service';
import { SubscriptionService } from '../services/subscription.service';
import { CrmMatchingHistoryService } from '../services/crmmatchinghistory.service';
import { PaginateResult } from 'mongoose';
export declare class VisitorController {
    private visitorService;
    private visitService;
    private taskService;
    private clientService;
    private subscriptionService;
    private crmMatchingHistoryService;
    private leadPriorityService;
    constructor(visitorService: VisitorService, visitService: VisitService, taskService: TasksService, clientService: ClientService, subscriptionService: SubscriptionService, crmMatchingHistoryService: CrmMatchingHistoryService, leadPriorityService: LeadPriorityService);
    parseFilters: (filters: any) => any;
    findAll(page: string, limit: string, sortField: string, sortOrder: string, loginAPIAccessKey: any, filters: any, req: any): Promise<PaginateResult<any>>;
    getDuplicates(deleteDuplicate: any): Promise<any>;
    recorrectVisitCount(id: any): Promise<void>;
    export(loginAPIAccessKey: any, filters: any, sortField: string, sortOrder: string, req: any): Promise<{
        success: number;
        fileName: string;
    }>;
    exportCrmMatchingHistory(loginAPIAccessKey: any, filters: any, sortField: string, sortOrder: string, req: any): Promise<{
        success: number;
        fileName: string;
    }>;
    crmUpload(file: any, req: any): Promise<{
        tabledata: import("../schemas/crmmatchinghistory.schema").CrmMatchingHistoryDocument[];
        status: boolean;
        errors: any[];
    }>;
    crmMatchingHistory(req: any): Promise<{
        tabledata: import("../schemas/crmmatchinghistory.schema").CrmMatchingHistoryDocument[];
        status: boolean;
        errors: any[];
    }>;
    deleteCrmMatchingFile(req: any, crmMatchId: string): Promise<{
        result: import("../schemas/crmmatchinghistory.schema").CrmMatchingHistoryDocument;
        status: boolean;
        errors: any[];
    }>;
    task(startDate: any, endDate: any): void;
    syncReports(): void;
    getPeoplesData(email: string): void;
}
