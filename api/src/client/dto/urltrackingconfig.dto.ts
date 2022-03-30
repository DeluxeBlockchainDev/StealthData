import { IsString, IsNotEmpty, IsDate  } from 'class-validator';

export class CreateUrlTrackingConfigDto {

	@IsString()
	@IsNotEmpty()
	url?: string;

	@IsDate()
	@IsNotEmpty()
	createdAt?: Date;

	@IsDate()
	status?: Boolean;
	
	@IsString()
	@IsNotEmpty()
	uId?: string;
}

export class UpdateUrlTrackingConfigDto {

	@IsString()
	@IsNotEmpty()
	url?: string;

	@IsDate()
	@IsNotEmpty()
	createdAt?: Date;

	@IsDate()
	status?: Boolean;
	
	@IsString()
	@IsNotEmpty()
	uId?: string;
}