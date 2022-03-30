import { IsString, IsNotEmpty, IsNumber, IsObject, IsEmail } from 'class-validator';
import { Address } from './client.dto';

class CheckDetails {

    @IsNotEmpty()
    @IsString()
    accountNumber:string;

	@IsNotEmpty()
	@IsString()
	routingNumber: string;

	@IsNotEmpty()
	@IsString()
	checkType: string;

	@IsNotEmpty()
	@IsString()
	accountType: string;

}

// For both basic and recurring payment
export class MakePaymentDto {

    @IsNotEmpty()
    @IsString()
    token:string;

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
    @IsNumber()
    amount:number;

    @IsNotEmpty()
    @IsString()
	type:string;
	
	@IsNotEmpty()
    @IsString()
    subscriptionId:string;

    @IsNotEmpty()
    @IsObject()
    billingAddress:Address;

	@IsNotEmpty()
	@IsString()
	contactNo: string;
    
}
export class MakeCheckPaymentDto {

   
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
    @IsNumber()
    amount:number;

    @IsNotEmpty()
    @IsString()
	type:string;
	
	@IsNotEmpty()
    @IsString()
    subscriptionId:string;

    @IsNotEmpty()
    @IsObject()
    billingAddress:Address;

	@IsObject()
	checkDetails: CheckDetails;
    
}