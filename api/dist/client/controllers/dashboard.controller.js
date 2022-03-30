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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const visit_service_1 = require("../services/visit.service");
const visitor_service_1 = require("../services/visitor.service");
const uniqBy = require("lodash.uniqby");
const campaign_stat_service_1 = require("../services/campaign-stat.service");
const xlsx = require("xlsx");
const Client = require("ftp");
const fs = require("fs");
const unsubscribed_user_service_1 = require("../services/unsubscribed-user.service");
const client_service_1 = require("../services/client.service");
let DashboardController = class DashboardController {
    constructor(visitService, visitorService, campaignStatService, unsubscribedUserService, clientService) {
        this.visitService = visitService;
        this.visitorService = visitorService;
        this.campaignStatService = campaignStatService;
        this.unsubscribedUserService = unsubscribedUserService;
        this.clientService = clientService;
    }
    async getTopVisitors(filters, loginAPIAccessKey) {
        filters = filters ? JSON.parse(filters) : {};
        const today = new Date();
        const startDate = new Date(today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), 31);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 0);
        const result = await this.visitService.aggregate([
            {
                $match: {
                    visitedAt: { $gte: startDate, $lte: endDate },
                    loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
                }
            },
            {
                $group: { _id: "$email", count: { $sum: 1 } }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 7
            }
        ]);
        let topVisitors = await this.visitorService.findAll({ email: { $in: result.map((a) => a._id) }, loginAPIAccessKey: { $eq: loginAPIAccessKey || '' } });
        topVisitors = uniqBy(topVisitors, 'email').map((v) => {
            const _v = result.find((r) => r._id === v.email);
            return _v ? Object.assign(Object.assign({}, v._doc), { monthlyVisitCount: _v.count }) : v._doc;
        }).sort((a, b) => b.monthlyVisitCount - a.monthlyVisitCount);
        return topVisitors;
    }
    processFileManual({ stream, fileName, clientMap, destDir, crDate }, onDownload) {
        const campaignStatsWrite = [];
        const unsubscribedUserWrite = [];
        stream.pipe(fs.createWriteStream(`${destDir}/${fileName}`));
        stream.once('close', () => {
            console.log('Downloaded', `${destDir}/${fileName}`);
            const reportData = xlsx.readFile(`${destDir}/${fileName}`, { cellDates: true });
            let jsonStream = xlsx.stream.to_json(reportData['Sheets']['Sheet1'], { raw: true });
            if (fileName.includes('message_stats_daily')) {
                jsonStream.on('data', (row) => {
                    let clientId = clientMap.get(row.campaign_name.substring(2));
                    if (!!clientId) {
                        campaignStatsWrite.push({
                            insertOne: {
                                document: {
                                    messageId: row.message_id,
                                    campaignId: row.campaign_id,
                                    uniqueOpenRate: row.unique_open_rate,
                                    clickRate: row.click_rate,
                                    linksClicked: row.unique_links_clicked,
                                    uniqueClickRate: row.unique_click_rate,
                                    totalEmailsSent: row.total_emails_sent,
                                    emailsSent: row.emails_sent,
                                    emailsDelivered: row.emails_delivered,
                                    emailsOpened: row.unique_opens,
                                    campaignName: row.campaign_name,
                                    unsubscribeRate: row.unsubscribe_rate,
                                    totalUnsubscribed: row.unsubscribed,
                                    clientId,
                                    fileName,
                                    createdAt: crDate
                                }
                            }
                        });
                    }
                });
                jsonStream.on('end', () => {
                    console.log('campaignStatsWrite', campaignStatsWrite.length);
                    campaignStatsWrite && campaignStatsWrite.length &&
                        this.campaignStatService.bulkWrite(campaignStatsWrite);
                });
            }
            else if (fileName.includes('removed_contacts_daily')) {
                jsonStream.on('data', (row) => {
                    let clientId = clientMap.get(row.list_name.substring(2));
                    if (!!clientId && row.delete_time) {
                        unsubscribedUserWrite.push({
                            insertOne: {
                                document: {
                                    deletedAt: row.delete_time,
                                    email: row.email,
                                    campaignName: row.list_name,
                                    clientId,
                                    fileName,
                                    createdAt: crDate
                                }
                            }
                        });
                    }
                });
                jsonStream.on('end', () => {
                    console.log('unsubscribedUserWrite', unsubscribedUserWrite.length);
                    unsubscribedUserWrite && unsubscribedUserWrite.length &&
                        this.unsubscribedUserService.bulkWrite(unsubscribedUserWrite);
                });
            }
            onDownload({ fileName });
        });
    }
    async test(dateString) {
        try {
            let crDate = new Date(dateString);
            crDate.setDate(crDate.getDate() + 1);
            dateString = dateString.replace(/\\|\//g, '');
            const clients = await this.clientService.findAll();
            const clientMap = new Map();
            for (let client of clients)
                clientMap.set(client.companyName.replace(/ /g, '').toLowerCase(), client._id);
            const destDir = `${process.cwd()}/../../dest`;
            const client = new Client();
            client.on('ready', () => {
                client.list('reports/', async (err, list) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('dateString', dateString);
                        console.log('sv...', `message_stats_daily_${dateString}`);
                        const filteredFiles = list.filter((file) => file.name.includes(`message_stats_daily_${dateString}`) || file.name.includes(`removed_contacts_daily_${dateString}`));
                        let downloadedFilesCount = 0, existingFilesCount = 0;
                        if (!filteredFiles.length) {
                            console.log('No file available to download');
                            client.end();
                        }
                        else {
                            for (let file of filteredFiles) {
                                const fileName = file.name;
                                const existingFileQuery = fileName.includes(`message_stats_daily_${dateString}`)
                                    ? this.campaignStatService.findAll({ fileName })
                                    : fileName.includes(`removed_contacts_daily_${dateString}`)
                                        ? this.unsubscribedUserService.findAll({ fileName }) : null;
                                const existingFile = await existingFileQuery;
                                if (existingFile && !existingFile.length) {
                                    console.log('Downloading File');
                                    client.get(`reports/${fileName}`, (err, stream) => {
                                        if (err) {
                                            console.log('Error While Downloading File', fileName);
                                        }
                                        else {
                                            this.processFileManual({
                                                stream,
                                                fileName,
                                                destDir,
                                                clientMap,
                                                crDate
                                            }, ({ fileName }) => {
                                                downloadedFilesCount++;
                                                console.log('downloadedFilesCount', downloadedFilesCount);
                                                console.log('existingFilesCount', existingFilesCount);
                                                console.log('totalFilesCount', downloadedFilesCount + existingFilesCount);
                                                existingFilesCount + downloadedFilesCount === filteredFiles.length && client.end();
                                            });
                                        }
                                    });
                                }
                                else {
                                    console.log('File Already Exists');
                                    existingFilesCount++;
                                    console.log('downloadedFilesCount', downloadedFilesCount);
                                    console.log('existingFilesCount', existingFilesCount);
                                    console.log('totalFilesCount', downloadedFilesCount + existingFilesCount);
                                    existingFilesCount + downloadedFilesCount === filteredFiles.length && client.end();
                                }
                            }
                        }
                    }
                });
            });
            client.connect({
                host: process.env.FTP_URL,
                user: process.env.FTP_USER,
                password: process.env.FTP_PASSWORD,
            });
            client.on('greeting', console.log);
            client.on('error', (err) => console.log(err));
            client.on('end', () => console.log('Connection Ended!'));
        }
        catch (e) {
            console.log(e);
        }
    }
    async getLeadPriority(loginAPIAccessKey) {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0);
        const result = await this.visitorService.aggregate([
            {
                $match: {
                    lastVisitedAt: { $gte: startDate, $lte: endDate },
                    loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
                }
            },
            {
                $group: { _id: "$priority", count: { $sum: 1 } }
            },
        ]);
        return result;
    }
    async getVisitorStats(loginAPIAccessKey) {
        const weekdays = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thurs",
            "Fri",
            "Sat",
        ];
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0);
        const totalVisitorsIdentified = await this.visitorService.count({ dateIdentified: { $gte: startDate, $lte: endDate }, loginAPIAccessKey });
        const totalVisitors = await this.visitorService.count({ lastVisitedAt: { $gte: startDate, $lte: endDate }, loginAPIAccessKey });
        const totalCrmMatched = await this.visitorService.count({ crmMatchDate: { $exists: true, $gte: startDate, $lte: endDate }, loginAPIAccessKey });
        let result = await this.visitService.aggregate([
            {
                $match: {
                    visitedAt: { $gte: startDate, $lte: endDate },
                    loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
                }
            },
            {
                $group: { _id: "$email", visitedAt: { $first: "$visitedAt" } },
            },
            {
                $group: { _id: { $dayOfYear: "$visitedAt" }, visitedAt: { $first: "$visitedAt" }, count: { $sum: 1 } }
            }
        ]);
        const dailyVisitorData = [];
        for (let i = 0; i < endDate.getDate(); i++) {
            let _date = new Date();
            _date.setDate(1 + i);
            const dat = result.find((d) => new Date(d.visitedAt).toLocaleDateString() === _date.toLocaleDateString());
            dat ? dailyVisitorData.push({ label: weekdays[_date.getDay()], count: dat.count }) : dailyVisitorData.push({ label: weekdays[_date.getDay()], count: 0 });
        }
        return { totalVisitorsIdentified, totalVisitors, dailyVisitorData, totalCrmMatched };
    }
    async getTopUrls(filters, loginAPIAccessKey) {
        filters = filters ? JSON.parse(filters) : {};
        const today = new Date();
        let startDate = new Date();
        let endDate = new Date();
        switch (filters.type) {
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), 31);
                break;
            case 'week':
                const startOfWeek = today.getDate() - today.getDay();
                const endOfWeek = startOfWeek + 7;
                startDate = new Date(today.getFullYear(), today.getMonth(), startOfWeek);
                endDate = new Date(today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), endOfWeek);
                break;
            default:
                break;
        }
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 0);
        const result = await this.visitService.aggregate([
            {
                $match: {
                    visitedAt: { $gte: startDate, $lte: endDate },
                    loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
                }
            },
            {
                $group: { _id: "$pageUrl", email: { $last: "$email" }, count: { $sum: 1 } }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 5
            }
        ]);
        return result;
    }
    async getEmailStats(req) {
        const { id } = req.user;
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0);
        console.log('startDate', startDate);
        console.log('endDate', endDate);
        let result = await this.campaignStatService.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    clientId: { $eq: id }
                }
            },
            {
                $group: { _id: "$clientId", countPercentage: { $sum: 1 }, totalUniqueOpenRate: { $sum: "$uniqueOpenRate" },
                    totalClickRate: { $sum: "$uniqueClickRate" }, totalUnsubscribeRate: { $sum: "$unsubscribeRate" },
                    totalEmailsSent: { $last: "$totalEmailsSent" }, emailsSent: { $sum: "$emailsSent" },
                    emailsDelivered: { $sum: "$emailsDelivered" }, emailsOpened: { $sum: "$emailsOpened" },
                    totalUnsubscribed: { $sum: "$totalUnsubscribed" }, linksClicked: { $sum: "$linksClicked" } },
            },
            {
                $project: {
                    opened: { $divide: ["$totalUniqueOpenRate", "$countPercentage"] },
                    clicked: { $divide: ["$totalClickRate", "$countPercentage"] },
                    unsubscribed: { $divide: ["$totalUnsubscribeRate", "$countPercentage"] },
                    emailsSent: "$totalEmailsSent",
                    monthlyEmailsSent: "$emailsSent",
                    emailsDelivered: "$emailsDelivered",
                    emailsOpened: "$emailsOpened",
                    totalUnsubscribed: "$totalUnsubscribed",
                    linksClicked: "$linksClicked"
                }
            }
        ]);
        return Object.assign({}, (result && result[0]) ? Object.assign({}, result[0]) : { opened: 0, clicked: 0, unsubscribed: 0 });
    }
};
__decorate([
    common_1.Get('/topVisitors'),
    __param(0, common_1.Query('filters')), __param(1, common_1.Query('loginAPIAccessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTopVisitors", null);
__decorate([
    common_1.Get('/manualEntry'),
    __param(0, common_1.Query('dateString')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "test", null);
__decorate([
    common_1.Get('/leadPriority'),
    __param(0, common_1.Query('loginAPIAccessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getLeadPriority", null);
__decorate([
    common_1.Get('/visitorStats'),
    __param(0, common_1.Query('loginAPIAccessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getVisitorStats", null);
__decorate([
    common_1.Get('/topUrls'),
    __param(0, common_1.Query('filters')), __param(1, common_1.Query('loginAPIAccessKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTopUrls", null);
__decorate([
    common_1.Get('/emailStats'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getEmailStats", null);
DashboardController = __decorate([
    common_1.Controller('dashboard'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [visit_service_1.VisitService,
        visitor_service_1.VisitorService,
        campaign_stat_service_1.CampaignStatService,
        unsubscribed_user_service_1.UnsubscribedUserService,
        client_service_1.ClientService])
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map