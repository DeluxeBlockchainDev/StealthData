import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from '../schemas/client.schema';
import { ClientSearchParamsDto, CreateClientDto, UpdateClientDto } from '../dto/client.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClientService {
  constructor(private jwtService: JwtService,
    @InjectModel(Client.name) private clientModel: PaginateModel<ClientDocument>
    ) {}

  async create(createCatDto: CreateClientDto): Promise<ClientDocument> {
    const createdCat = new this.clientModel(createCatDto);
    return createdCat.save();
  }

  async findOneAndUpdate(params:ClientSearchParamsDto, updateClientDto: UpdateClientDto): Promise<ClientDocument> {
    return this.clientModel.findOneAndUpdate(params, updateClientDto).exec();
  }

  async updateMany(params:ClientSearchParamsDto, updateClientDto: UpdateClientDto): Promise<any> {
    return this.clientModel.updateMany(params, updateClientDto).exec();
  }

  async delete(_id:string): Promise<ClientDocument> {
    return this.clientModel.findOneAndUpdate({ _id }, { isDeleted: true, status: 'deleted' }).exec();
  }

  async findOne(params:ClientSearchParamsDto): Promise<ClientDocument> {
    return this.clientModel.findOne({ ...params, isActive:true, isDeleted: false }, { password: 0 }, { lean: true }).exec();
  }

  async findOneWithPassword(params:ClientSearchParamsDto): Promise<ClientDocument> {
    return this.clientModel.findOne({ ...params, isActive:true, isDeleted: false }, null, { lean: true }).exec();
  }

  async findAll(params?:ClientSearchParamsDto): Promise<ClientDocument[]> {
    return this.clientModel.find({ ...params, isActive:true, isDeleted: false }, { password: 0 }).exec();
  }

  async paginate( page: number = 1, limit: number = 10, params?:ClientSearchParamsDto ): Promise<PaginateResult<ClientDocument>> {
    return this.clientModel.paginate({ ...params, isDeleted: false }, { select: { password: 0 }, limit, page });
  }

  async genrateToken(user: any) {
    const payload = { email: user.email, id: user._id, isAdmin: !!user.isAdmin, firstName: user.firstName };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
