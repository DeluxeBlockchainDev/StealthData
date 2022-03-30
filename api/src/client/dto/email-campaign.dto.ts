import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional  } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateEmailCampaignDto {
	
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	html?: string

	@IsOptional()
	@IsString()
	autoResponderId?: string

	@IsOptional()
	@IsString()
	fromField?: string

	@IsOptional()
	@IsString()
	replyTo?: string

	@IsNotEmpty()
	@IsString()
	subject?: string

	@IsNotEmpty()
	@IsString()
	campaignTypeId?: string

	@IsOptional()
	editorDesign?: any

	@IsOptional()
	@IsString()
	clientId?: string
}

export class UpdateEmailCampaignDto {

	@IsString()
	name?: string;
	
	@IsNotEmpty()
	@IsString()
	html?: string

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	autoResponderId?: string

	@IsOptional()
	@IsString()
	fromField?: string

	@IsOptional()
	@IsString()
	replyTo?: string

	@IsNotEmpty()
	@IsString()
	subject?: string

	@IsNotEmpty()
	@IsString()
	campaignTypeId?: string

	@IsOptional()
	editorDesign?: any

	@IsBoolean()
	isActive?: boolean
}

export class EmailCampaignSearchParamsDto {
	
	_id?: any
	clientId?: any;
	name?: string;
	campaignTypeId?: any;
	isDeleted?: boolean;
	isActive?: boolean;
}