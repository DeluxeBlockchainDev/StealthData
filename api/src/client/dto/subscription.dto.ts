import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional  } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateSubscriptionDto {
	
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNumber()
	@IsNotEmpty()
	uniqueVisitorsMonthlyLimit?: number;

	@IsBoolean()
	@IsNotEmpty()
	isHotPriorityAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isDashboardAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isEmailCampaignsAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isCrmMatchingAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isVisits?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isUrlsViewed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isLeadPriority?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isCrmMatched?: boolean;

	
	@IsBoolean()
	@IsNotEmpty()
	isDashboardCrmMatched?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isMonthlyLeadPriority?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isMonthlyEmailStats?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isTop5Urls?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isTopVisitors?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isAccessToCorporate?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isAdvancedXLSXExport?: boolean;


	@IsBoolean()
	@IsNotEmpty()
	customUrlTracking?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	customLeadPriority?: boolean;

	@IsNumber()
	@IsNotEmpty()
	price?: number;

	@IsNumber()
	@IsOptional()
	annualDiscount?: number;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@IsString()
	@IsOptional()
	html?: string;

	@IsNumber()
	@IsOptional()
	listOrder?: number;

	@IsNumber()
	@IsOptional()
	additionalFee?: number;

	@IsBoolean()
	@IsNotEmpty()
	isCustomPackage?: boolean;
}

export class UpdateSubscriptionDto {

	@IsString()
	name?: string;

	@IsNumber()
	@IsNotEmpty()
	uniqueVisitorsMonthlyLimit?: number;

	@IsBoolean()
	@IsNotEmpty()
	isHotPriorityAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isEmailCampaignsAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isDashboardAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isCrmMatchingAllowed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isVisits?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isUrlsViewed?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isLeadPriority?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	isCrmMatched?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isDashboardCrmMatched?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isMonthlyLeadPriority?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isMonthlyEmailStats?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isTop5Urls?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isTopVisitors?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isAccessToCorporate?: boolean;
	
	@IsBoolean()
	@IsNotEmpty()
	isAdvancedXLSXExport?: boolean;


	@IsBoolean()
	@IsNotEmpty()
	customUrlTracking?: boolean;

	@IsBoolean()
	@IsNotEmpty()
	customLeadPriority?: boolean;

	@IsNumber()
	@IsNotEmpty()
	price?: number;

	@IsNumber()
	@IsOptional()
	annualDiscount?: number;

	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@IsString()
	@IsOptional()
	html?: string;

	@IsNumber()
	@IsOptional()
	listOrder?: number;
	
	@IsNumber()
	@IsOptional()
	additionalFee?: number;	

	@IsBoolean()
	@IsNotEmpty()
	isCustomPackage?: boolean;
	
}

export class SubscriptionSearchParamsDto {
	
	_id?: string | ObjectId

	name?: string;

	isDeleted?: boolean;
	isActive?: boolean;
}