export declare class CreateCrmMatchingHistoryDto {
    crmMatched: number;
    fileName?: string;
    filePath?: string;
    totalRecords: number;
    uploadDate?: Date;
    isDeleted?: Boolean;
    uID?: string;
}
export declare class UpdateCrmMatchingHistoryDto {
    crmMatched: number;
    fileName?: string;
    filePath?: string;
    totalRecords: number;
    uploadDate?: string;
    isDeleted?: Boolean;
    uID?: string;
}
