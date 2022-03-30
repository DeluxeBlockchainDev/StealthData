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
exports.ClientSchema = exports.Client = exports.Address = exports.CardInfo = exports.App = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoosePaginate = require("mongoose-paginate");
let App = class App {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], App.prototype, "url", void 0);
__decorate([
    mongoose_1.Prop({ default: {}, type: Object }),
    __metadata("design:type", Object)
], App.prototype, "req", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], App.prototype, "loginGUID", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], App.prototype, "loginAPIAccessKey", void 0);
App = __decorate([
    mongoose_1.Schema()
], App);
exports.App = App;
let CardInfo = class CardInfo {
};
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CardInfo.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CardInfo.prototype, "cardnumber", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CardInfo.prototype, "cvv", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], CardInfo.prototype, "expiredate", void 0);
CardInfo = __decorate([
    mongoose_1.Schema()
], CardInfo);
exports.CardInfo = CardInfo;
let Address = class Address {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Address.prototype, "line1", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "line2", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "zipcode", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Address.prototype, "state", void 0);
__decorate([
    mongoose_1.Prop({ default: 'USA' }),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
Address = __decorate([
    mongoose_1.Schema()
], Address);
exports.Address = Address;
let Client = class Client {
};
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "firstName", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "lastName", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "password", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "username", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "description", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "subscriptionId", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "contactNo", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", String)
], Client.prototype, "companyName", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Client.prototype, "avatar", void 0);
__decorate([
    mongoose_1.Prop({ default: [] }),
    __metadata("design:type", Array)
], Client.prototype, "fromFields", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", Array)
], Client.prototype, "apps", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Client.prototype, "customerGUID", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", Address)
], Client.prototype, "address", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "monthlyVisitorIdentificationAlertCount", void 0);
__decorate([
    mongoose_1.Prop({ default: 'live', enum: ['live', 'paused', 'cancelled', 'deleted', 'paused_backend'] }),
    __metadata("design:type", String)
], Client.prototype, "status", void 0);
__decorate([
    mongoose_1.Prop({ default: Date.now() }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    mongoose_1.Prop({ default: true }),
    __metadata("design:type", Boolean)
], Client.prototype, "isActive", void 0);
__decorate([
    mongoose_1.Prop({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "uniqueVisitorsMonthly", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Client.prototype, "isDeleted", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", CardInfo)
], Client.prototype, "cardInfo", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", Boolean)
], Client.prototype, "isAdditionalFee", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Client.prototype, "customerProfileId", void 0);
__decorate([
    mongoose_1.Prop({ default: '' }),
    __metadata("design:type", String)
], Client.prototype, "customerPaymentProfileId", void 0);
__decorate([
    mongoose_1.Prop({}),
    __metadata("design:type", Date)
], Client.prototype, "lastBillingDate", void 0);
__decorate([
    mongoose_1.Prop({ default: false }),
    __metadata("design:type", Boolean)
], Client.prototype, "isLeadProritySet", void 0);
Client = __decorate([
    mongoose_1.Schema()
], Client);
exports.Client = Client;
exports.ClientSchema = mongoose_1.SchemaFactory.createForClass(Client);
exports.ClientSchema.plugin(mongoosePaginate);
//# sourceMappingURL=client.schema.js.map