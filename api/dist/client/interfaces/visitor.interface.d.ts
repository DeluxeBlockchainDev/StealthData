export declare class ICreateVisitor {
    firstName: string;
    autoResponderListName?: string;
    autoResponderListDate?: Date;
}
export declare class IUpdateVisitor {
    firstName?: string;
    priority?: any;
    crmMatchDate?: Date;
    crmMatchId?: string;
    autoResponderListName?: string;
    autoResponderListDate?: Date;
}
export declare class ISearchVisitors {
    firstName?: string;
    startdate?: Date | string;
    enddate?: Date | string;
    apikey?: string;
    loginAPIAccessKey?: any;
    igIndividualId?: any;
    email?: any;
    dateIdentified?: any;
    priority?: any;
    lastVisitedAt?: any;
    crmMatchDate?: any;
    crmMatchId?: string;
    $or?: any;
    autoResponderListName?: string;
    autoResponderListDate?: Date;
}
