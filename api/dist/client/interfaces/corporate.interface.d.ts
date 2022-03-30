export declare class ICreateCorporate {
}
export declare class IUpdateVisitor {
    fullName?: string;
    priority?: any;
    crmMatchDate?: Date;
    crmMatchId?: string;
    autoResponderListName?: string;
    autoResponderListDate?: Date;
}
export declare class ISearchCorporate {
    fullName?: string;
    loginAPIAccessKey?: any;
    email?: any;
    $or?: any;
}
