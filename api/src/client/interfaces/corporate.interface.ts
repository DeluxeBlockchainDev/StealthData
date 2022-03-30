export class ICreateCorporate {
    // firstName: string;
    // autoResponderListName?:string;
    // autoResponderListDate?: Date;
}

export class IUpdateVisitor {
    fullName?:string;
    priority?: any
    crmMatchDate?:Date;
    crmMatchId?:string;
    autoResponderListName?:string;
    autoResponderListDate?: Date;
}

export class ISearchCorporate { 
    fullName?: string;
	loginAPIAccessKey?: any
    email?:any
    $or?: any;
}