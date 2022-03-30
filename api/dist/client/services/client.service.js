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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const client_schema_1 = require("../schemas/client.schema");
const jwt_1 = require("@nestjs/jwt");
let ClientService = class ClientService {
    constructor(jwtService, clientModel) {
        this.jwtService = jwtService;
        this.clientModel = clientModel;
    }
    async create(createCatDto) {
        const createdCat = new this.clientModel(createCatDto);
        return createdCat.save();
    }
    async findOneAndUpdate(params, updateClientDto) {
        return this.clientModel.findOneAndUpdate(params, updateClientDto).exec();
    }
    async updateMany(params, updateClientDto) {
        return this.clientModel.updateMany(params, updateClientDto).exec();
    }
    async delete(_id) {
        return this.clientModel.findOneAndUpdate({ _id }, { isDeleted: true, status: 'deleted' }).exec();
    }
    async findOne(params) {
        return this.clientModel.findOne(Object.assign(Object.assign({}, params), { isActive: true, isDeleted: false }), { password: 0 }, { lean: true }).exec();
    }
    async findOneWithPassword(params) {
        return this.clientModel.findOne(Object.assign(Object.assign({}, params), { isActive: true, isDeleted: false }), null, { lean: true }).exec();
    }
    async findAll(params) {
        return this.clientModel.find(Object.assign(Object.assign({}, params), { isActive: true, isDeleted: false }), { password: 0 }).exec();
    }
    async paginate(page = 1, limit = 10, params) {
        return this.clientModel.paginate(Object.assign(Object.assign({}, params), { isDeleted: false }), { select: { password: 0 }, limit, page });
    }
    async genrateToken(user) {
        const payload = { email: user.email, id: user._id, isAdmin: !!user.isAdmin, firstName: user.firstName };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
ClientService = __decorate([
    common_1.Injectable(),
    __param(1, mongoose_1.InjectModel(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], ClientService);
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map