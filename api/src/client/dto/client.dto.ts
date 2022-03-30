import { Optional } from '@nestjs/common';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray, IsObject, IsNumber, IsBoolean,  } from 'class-validator';
import { isObject } from 'validate.js';
class App {

	url: string;

	loginGUID?: string

	loginAPIAccessKey?: string

	req?: any;
}

export class Address {
	
	line1: string;

	line2?: string;

	city: string;
	
	zipcode: string;

	state: string;

	country?: string

}
export class CardInfo {

	name : string;

	cardnumber: string;

	cvv: string;

	expiredate: string;

}

export class CreateClientDto {
	
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsNotEmpty()
	@IsString()
	lastName: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsString()
	subscriptionId: string;

	@IsNotEmpty()
	@IsString()
	contactNo: string;

	@IsOptional()
	$addToSet?: any;

	@IsNotEmpty()
	@IsString()
	companyName: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	avatar?: string;

	@IsOptional()
	@IsString()
	status?: string;
	
	@IsOptional()
	monthlyVisitorIdentificationAlertCount?: number;

	@IsOptional()
	apps: App[];

	@IsObject()
	address: Address;

	@IsNotEmpty()
	@IsString()
	invoiceId: string;

	@IsObject()
	cardInfo: CardInfo;
	
	@IsOptional()
	customerProfileId: string;

	@IsOptional()
	customerPaymentProfileId: string;
}

export class UpdateClientDto {

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	lastName?: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email?: string;

	@IsNotEmpty()
	@IsString()
	username?: string;
	
	@IsNotEmpty()
	@IsString()
	@IsOptional()
	password?: string;

	@IsNotEmpty()
	@IsString()
	@IsOptional()
	contactNo?: string;

	@IsOptional()
	$addToSet?: any;

	@IsString()
	@IsOptional()
	subscriptionId?: string;

	@IsNotEmpty()
	@IsString()
	@IsOptional()
	companyName?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	avatar?: string;

	@IsOptional()
	@IsString()
	customerGUID?: string;

	@IsOptional()
	@IsString()
	status?: string;

	@IsOptional()
	monthlyVisitorIdentificationAlertCount?: number;

	@IsArray()
	apps?: App[];

	uniqueVisitorsMonthly?: number;

	@IsObject()
	address?: Address;

	@IsObject()
	cardInfo?: CardInfo;
	
	@IsString()
	isAdditionalFee?: boolean;

	@IsString()
	customerProfileId?: string;

	@IsString()
	customerPaymentProfileId?: string;

	@IsOptional()
	lastBillingDate?: Date;

	@IsOptional()
	isLeadProritySet?: boolean;
}

export class ClientSearchParamsDto {
	
	_id?: any

	name?: string;
	
	email?: string;

	companyName?: string;

	contactNo?: string;

	isDeleted?: boolean;

	status?: string;

	isActive?: boolean;

	$or?: any;
}