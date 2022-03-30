/// <reference types="mongoose-paginate" />
import { PaginateModel, PaginateResult } from 'mongoose';
import { LeadPriorityDocument } from '../schemas/leadpriority.schema';
import { CreateLeadPriority, LeadPrioritySearchParamsDto } from '../dto/leadpriority.dto';
export declare class LeadPriorityService {
    private lpModel;
    constructor(lpModel: PaginateModel<LeadPriorityDocument>);
    create(createCorporate: CreateLeadPriority): Promise<LeadPriorityDocument>;
    findOne(params: any): Promise<LeadPriorityDocument>;
    findAll(params?: CreateLeadPriority, selectParams?: any, limit?: number, skip?: number): Promise<LeadPriorityDocument[]>;
    paginate(page?: number, limit?: number, sort?: {
        createdAt: number;
    }, params?: LeadPrioritySearchParamsDto): Promise<PaginateResult<LeadPriorityDocument>>;
}
