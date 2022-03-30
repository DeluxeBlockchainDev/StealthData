import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLeadPriority {
	
	@IsNotEmpty()
	@IsNumber()
	mild: number;

	@IsNotEmpty()
	@IsNumber()
	warm: number;

	@IsNotEmpty()
	@IsNumber()
	hot: number;
}

export class LeadPrioritySearchParamsDto {
	_id?: any

	mild?: number;
	
	warm?: number;

	hot?: number;

	clientId?: any;
}