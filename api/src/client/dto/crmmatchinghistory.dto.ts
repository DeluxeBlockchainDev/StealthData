import { IsString, IsNotEmpty, IsNumber, IsDate  } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCrmMatchingHistoryDto {

	@IsNotEmpty()
	@IsNumber()
	crmMatched: number;

	@IsString()
	@IsNotEmpty()
	fileName?: string;

	@IsString()
	@IsNotEmpty()
	filePath?: string;

	@IsString()
	@IsNotEmpty()
	matchedEmails?: string;
	
	@IsNotEmpty()
	@IsNumber()
	totalRecords: number;

	@IsDate()
	@IsNotEmpty()
	uploadDate?: Date;

	@IsDate()
	isDeleted?: Boolean;
	
	@IsString()
	@IsNotEmpty()
	uID?: string;
}

export class UpdateCrmMatchingHistoryDto {

	@IsNotEmpty()
	@IsNumber()
	crmMatched: number;

	@IsString()
	@IsNotEmpty()
	fileName?: string;

	@IsString()
	@IsNotEmpty()
	filePath?: string;

	@IsString()
	@IsNotEmpty()
	matchedEmails?: string;
	
	@IsNotEmpty()
	@IsNumber()
	totalRecords: number;

	@IsString()
	@IsNotEmpty()
	uploadDate?: string;

	@IsDate()
	isDeleted?: Boolean;
	
	@IsString()
	@IsNotEmpty()
	uID?: string;
	
}