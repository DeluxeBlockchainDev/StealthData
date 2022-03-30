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
exports.EmailCampaignController = void 0;
const common_1 = require("@nestjs/common");
const stealth_service_1 = require("../../common/services/stealth.service");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const email_campaign_service_1 = require("../services/email-campaign.service");
const email_campaign_dto_1 = require("../dto/email-campaign.dto");
const get_response_service_1 = require("../../common/services/get-response.service");
const client_service_1 = require("../services/client.service");
const constant_1 = require("../constant");
const flatten = require("lodash.flatten");
let EmailCampaignController = class EmailCampaignController {
    constructor(emailCampaignService, clientService, getResponseService) {
        this.emailCampaignService = emailCampaignService;
        this.clientService = clientService;
        this.getResponseService = getResponseService;
    }
    async create(createDto, req) {
        const { id } = req.user;
        const existingCampaign = await this.emailCampaignService.findAll({ campaignTypeId: createDto.campaignTypeId });
        if (existingCampaign && existingCampaign.length) {
            throw new common_1.BadRequestException('Campaign with provided campaign type already exists!');
        }
        const autoResponder = await this.getResponseService.createAutoResponder(createDto);
        const emailCampaign = await this.emailCampaignService.create(Object.assign(Object.assign({}, createDto), { clientId: id, autoResponderId: autoResponder.autoresponderId }));
        return emailCampaign;
    }
    findAll(req) {
        const { id } = req.user;
        const emailCampaigns = this.emailCampaignService.findAll({ clientId: id });
        return emailCampaigns;
    }
    async getCampaignTypes(req) {
        const { id } = req.user;
        const client = await this.clientService.findOne({ _id: id });
        let campaignTypes = await this.getResponseService.getCampaigns({ companyName: client.companyName });
        return campaignTypes.map((campaignType) => (Object.assign(Object.assign({}, campaignType), { displayName: `${campaignType.name[0]}${campaignType.name[1]}` === `${constant_1.LEAD_PRIORITIES.HOT[0]}_` ? 'Hot'
                : `${campaignType.name[0]}${campaignType.name[1]}` === `${constant_1.LEAD_PRIORITIES.WARM[0]}_` ? 'Warm'
                    : `${campaignType.name[0]}${campaignType.name[1]}` === `${constant_1.LEAD_PRIORITIES.MILD[0]}_` ? 'Mild'
                        : '' })));
    }
    async getFromFields(req) {
        const { id } = req.user;
        const client = await this.clientService.findOne({ _id: id });
        const promises = client.fromFields ? client.fromFields.map((email) => this.getResponseService.getFromFields({ email, isActive: true })) : [];
        const fromFields = await Promise.all(promises);
        return flatten(fromFields);
    }
    async addFromFields(req, body) {
        const { id } = req.user;
        const { email, name } = body;
        try {
            let existingFromField;
            try {
                existingFromField = await this.getResponseService.getFromFields({ email, name });
            }
            catch (e) {
                throw new common_1.BadRequestException('Unable to fetch from fields!');
            }
            let message = 'Email processed successfully, you will receive a verification link on the provided email. Please use the same to verify your email such that you can start using it to setup email campaigns!', success = 1;
            if (existingFromField && existingFromField.length) {
                const isPending = existingFromField.find((field) => !field.isActive);
                if (isPending) {
                    success = 0, message = 'Email already queued for verification, please click on verification link to approve the same!';
                }
                else {
                    message = 'Email already setup. If you are unable to view your email, kindly refresh the page or contact the system admin.';
                }
            }
            else {
                try {
                    this.getResponseService.createFromField({ email, name });
                }
                catch (e) {
                    throw new common_1.BadRequestException('Unknown error while setting up from fields!');
                }
            }
            await this.clientService.findOneAndUpdate({ _id: id }, { $addToSet: { fromFields: email } });
            return { success, message };
        }
        catch (e) {
            throw new common_1.BadRequestException('Unknown Error!');
        }
    }
    async update(_id, updateDto) {
        const existingCampaign = await this.emailCampaignService.findAll({ _id: { $ne: _id }, campaignTypeId: updateDto.campaignTypeId });
        if (existingCampaign && existingCampaign.length) {
            throw new common_1.BadRequestException('Campaign with provided campaign type already exists!');
        }
        await this.getResponseService.updateAutoResponder(updateDto, updateDto.autoResponderId);
        const updatedEmailCampaign = await this.emailCampaignService.findOneAndUpdate({ _id }, updateDto);
        return updatedEmailCampaign;
    }
    read(_id) {
        const emailCampaign = this.emailCampaignService.findOne({ _id });
        return emailCampaign;
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()), __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_campaign_dto_1.CreateEmailCampaignDto, Object]),
    __metadata("design:returntype", Promise)
], EmailCampaignController.prototype, "create", null);
__decorate([
    common_1.Get(),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmailCampaignController.prototype, "findAll", null);
__decorate([
    common_1.Get('/campaignTypes'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailCampaignController.prototype, "getCampaignTypes", null);
__decorate([
    common_1.Get('/fromFields'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailCampaignController.prototype, "getFromFields", null);
__decorate([
    common_1.Post('/fromFields'),
    __param(0, common_1.Request()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmailCampaignController.prototype, "addFromFields", null);
__decorate([
    common_1.Put('/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, email_campaign_dto_1.UpdateEmailCampaignDto]),
    __metadata("design:returntype", Promise)
], EmailCampaignController.prototype, "update", null);
__decorate([
    common_1.Get('/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmailCampaignController.prototype, "read", null);
EmailCampaignController = __decorate([
    common_1.Controller('emailCampaign'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [email_campaign_service_1.EmailCampaignService,
        client_service_1.ClientService,
        get_response_service_1.GetResponseService])
], EmailCampaignController);
exports.EmailCampaignController = EmailCampaignController;
//# sourceMappingURL=email-campaign.controller.js.map