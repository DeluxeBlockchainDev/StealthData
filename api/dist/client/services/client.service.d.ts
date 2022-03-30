/// <reference types="mongoose-paginate" />
import { PaginateModel, PaginateResult } from 'mongoose';
import { ClientDocument } from '../schemas/client.schema';
import { ClientSearchParamsDto, CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import { JwtService } from '@nestjs/jwt';
export declare class ClientService {
    private jwtService;
    private clientModel;
    constructor(jwtService: JwtService, clientModel: PaginateModel<ClientDocument>);
    create(createCatDto: CreateClientDto): Promise<ClientDocument>;
    findOneAndUpdate(params: ClientSearchParamsDto, updateClientDto: UpdateClientDto): Promise<ClientDocument>;
    updateMany(params: ClientSearchParamsDto, updateClientDto: UpdateClientDto): Promise<any>;
    delete(_id: string): Promise<ClientDocument>;
    findOne(params: ClientSearchParamsDto): Promise<ClientDocument>;
    findOneWithPassword(params: ClientSearchParamsDto): Promise<ClientDocument>;
    findAll(params?: ClientSearchParamsDto): Promise<ClientDocument[]>;
    paginate(page?: number, limit?: number, params?: ClientSearchParamsDto): Promise<PaginateResult<ClientDocument>>;
    genrateToken(user: any): Promise<{
        access_token: string;
    }>;
}
