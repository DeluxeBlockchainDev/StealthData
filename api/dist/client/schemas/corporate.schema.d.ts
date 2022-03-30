/// <reference types="mongoose-paginate" />
import { Document } from 'mongoose';
export declare type CorporateDocument = CorporateData & Document;
export declare class CorporateData {
    corporateId: string;
    likeliHood: number;
    email: string;
    loginAPIAccessKey?: string;
    fullName: string;
    gender: string;
    birthYear: string;
    birthDate: string;
    linkedInURL: string;
    linkedInUsername: string;
    facebookURL: string;
    facebookUsername: string;
    twitterURL: string;
    twitterUsername: string;
    githubURL: string;
    githubUsername: string;
    workMail: string;
    jobTitle: string;
    jobTitleRole: string;
    jobCompanyId: string;
    jobCompanyName: string;
    jobCompanyWebsite: string;
    jobCompanySize: string;
    jobCompanyIndustry: string;
    jobCompanyLocationMetro: string;
    jobCompanyFacebookURL: string;
    jobCompanyLinkedInURL: string;
    jobCompanyTwitterURL: string;
    createdAt?: Date;
    isDeleted?: Boolean;
}
export declare const CorporateSchema: import("mongoose").Schema<any>;
