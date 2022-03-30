import { BadRequestException, Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { StealthService } from 'src/common/services/stealth.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { EmailCampaignService } from '../services/email-campaign.service';
import { CreateEmailCampaignDto, UpdateEmailCampaignDto } from '../dto/email-campaign.dto';
import { GetResponseService } from 'src/common/services/get-response.service';
import { ClientService } from '../services/client.service';
import { LEAD_PRIORITIES } from '../constant';
import * as flatten from 'lodash.flatten';

@Controller('emailCampaign')
@UseGuards(JwtAuthGuard)
export class EmailCampaignController {
  
  constructor(
    private emailCampaignService: EmailCampaignService,
    private clientService: ClientService,
    private getResponseService: GetResponseService
  ){}

  @Post()
  async create(@Body() createDto: CreateEmailCampaignDto, @Request() req) {
    const { id } = req.user;
    const existingCampaign = await this.emailCampaignService.findAll({ campaignTypeId: createDto.campaignTypeId });
    if( existingCampaign && existingCampaign.length ) {
      throw new BadRequestException('Campaign with provided campaign type already exists!')
    } 
    const autoResponder = await this.getResponseService.createAutoResponder( createDto )
    const emailCampaign = await this.emailCampaignService.create({ ...createDto, clientId: id, autoResponderId: autoResponder.autoresponderId });

    return emailCampaign;
  }

  @Get()
  findAll(@Request() req) {
    const { id } = req.user;
    const emailCampaigns = this.emailCampaignService.findAll({ clientId: id });
    return emailCampaigns;
  }

  @Get('/campaignTypes')
  async getCampaignTypes(@Request() req) {
    const { id } = req.user;
    const client = await this.clientService.findOne({ _id: id });
    let campaignTypes = await this.getResponseService.getCampaigns({ companyName: client.companyName })
    return campaignTypes.map((campaignType) => ({
      ...campaignType,
      displayName: `${campaignType.name[0]}${campaignType.name[1]}` === `${LEAD_PRIORITIES.HOT[0]}_` ? 'Hot' 
        : `${campaignType.name[0]}${campaignType.name[1]}` === `${LEAD_PRIORITIES.WARM[0]}_` ? 'Warm'
        : `${campaignType.name[0]}${campaignType.name[1]}` === `${LEAD_PRIORITIES.MILD[0]}_` ? 'Mild' 
        : ''
    }));
  }

  @Get('/fromFields')
  async getFromFields( @Request() req ) {
    const { id } = req.user;
    const client = await this.clientService.findOne({ _id: id });
    const promises = client.fromFields ? client.fromFields.map((email) => this.getResponseService.getFromFields({ email, isActive: true })) : [];
    const fromFields = await Promise.all(promises);
    return flatten(fromFields);
  }

  @Post('/fromFields')
  async addFromFields( @Request() req, @Body() body:any ) {
    const { id } = req.user;
    const { email, name } = body;
    try {
      let existingFromField;
      try {
        existingFromField = await this.getResponseService.getFromFields({ email, name });
      } catch(e) {
          throw new BadRequestException('Unable to fetch from fields!');
      }
      let message = 'Email processed successfully, you will receive a verification link on the provided email. Please use the same to verify your email such that you can start using it to setup email campaigns!', success = 1;
      if(existingFromField && existingFromField.length) {
        const isPending = existingFromField.find((field) => !field.isActive)
        if( isPending ) {
          success = 0, message = 'Email already queued for verification, please click on verification link to approve the same!';
        } else {
          message = 'Email already setup. If you are unable to view your email, kindly refresh the page or contact the system admin.';
        }
      } else {
        try {
          this.getResponseService.createFromField({ email, name });
        } catch(e) {
          throw new BadRequestException('Unknown error while setting up from fields!');
        }
      }
      await this.clientService.findOneAndUpdate({ _id: id }, { $addToSet: { fromFields: email } });
      return { success, message };
    } catch(e) {
      throw new BadRequestException('Unknown Error!');
    }
  }

  @Put('/:id')
  async update(@Param('id') _id:string, @Body() updateDto: UpdateEmailCampaignDto) {
    const existingCampaign = await this.emailCampaignService.findAll({ _id : { $ne : _id }, campaignTypeId: updateDto.campaignTypeId });
    if( existingCampaign && existingCampaign.length ) {
      throw new BadRequestException('Campaign with provided campaign type already exists!')
    } 
    await this.getResponseService.updateAutoResponder( updateDto, updateDto.autoResponderId )
    const updatedEmailCampaign = await this.emailCampaignService.findOneAndUpdate({ _id}, updateDto);
    return updatedEmailCampaign;
  }

  @Get('/:id')
  read(@Param('id') _id:string) {
    const emailCampaign = this.emailCampaignService.findOne({ _id});
    return emailCampaign;
  }
}