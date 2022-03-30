"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateSchema = exports.CorporateData = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoosePaginate = require("mongoose-paginate");
let CorporateData = class CorporateData {
};
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "corporateId", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", Number)
], CorporateData.prototype, "likeliHood", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "loginAPIAccessKey", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "fullName", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "gender", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "birthYear", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "birthDate", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "linkedInURL", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "linkedInUsername", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "facebookURL", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "facebookUsername", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "twitterURL", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "twitterUsername", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "githubURL", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "githubUsername", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "workMail", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobTitle", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobTitleRole", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyId", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyName", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyWebsite", void 0);
__decorate([
    mongoose_1.Prop({ default: 'mild' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanySize", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyIndustry", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyLocationMetro", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyFacebookURL", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyLinkedInURL", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CorporateData.prototype, "jobCompanyTwitterURL", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now }),
    __metadata("design:type", Date)
], CorporateData.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], CorporateData.prototype, "isDeleted", void 0);
CorporateData = __decorate([
    mongoose_1.Schema()
], CorporateData);
exports.CorporateData = CorporateData;
exports.CorporateSchema = mongoose_1.SchemaFactory.createForClass(CorporateData);
exports.CorporateSchema.plugin(mongoosePaginate);
//# sourceMappingURL=corporate.schema.js.map