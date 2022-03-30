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
exports.VisitorController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt.auth-guard");
const tasks_service_1 = require("../services/tasks.service");
const visit_service_1 = require("../services/visit.service");
const visitor_service_1 = require("../services/visitor.service");
const xlsx = require("xlsx");
const CrmValidator_1 = require("../validators/CrmValidator");
const platform_express_1 = require("@nestjs/platform-express");
const client_service_1 = require("../services/client.service");
const leadpriority_service_1 = require("../services/leadpriority.service");
const constant_1 = require("../constant");
const uuid_1 = require("uuid");
const subscription_service_1 = require("../services/subscription.service");
const crmmatchinghistory_service_1 = require("../services/crmmatchinghistory.service");
const crmmatchinghistory_dto_1 = require("../dto/crmmatchinghistory.dto");
const flatten = require("lodash.flatten");
const common_2 = require("@nestjs/common");
let VisitorController = class VisitorController {
    constructor(visitorService, visitService, taskService, clientService, subscriptionService, crmMatchingHistoryService, leadPriorityService) {
        this.visitorService = visitorService;
        this.visitService = visitService;
        this.taskService = taskService;
        this.clientService = clientService;
        this.subscriptionService = subscriptionService;
        this.crmMatchingHistoryService = crmMatchingHistoryService;
        this.leadPriorityService = leadPriorityService;
        this.parseFilters = (filters) => {
            let searchParams = {};
            if (!!filters.searchText) {
                searchParams.$or = [
                    ...flatten(filters.searchText.split(' ').map((text) => [
                        { email: { $regex: new RegExp(filters.searchText, 'i') } },
                        { firstName: { $regex: new RegExp(text, 'i') } },
                        { lastName: { $regex: new RegExp(filters.searchText, 'i') } },
                    ]))
                ];
            }
            if (!!filters.leadPriority) {
                searchParams.priority = filters.leadPriority;
            }
            if (!!filters.crmMatchDate) {
                searchParams.crmMatchDate = Object.assign({ $exists: true }, (filters.crmMatchDate === 'true' ?
                    { $ne: null } :
                    { $eq: null }));
            }
            return searchParams;
        };
    }
    async findAll(page, limit, sortField, sortOrder, loginAPIAccessKey, filters, req) {
        const { id } = req.user;
        filters = filters ? JSON.parse(filters) : {};
        let searchParams = this.parseFilters(filters);
        console.log('searchParams: ', searchParams);
        let sort = {
            lastVisitedAt: -1
        };
        let corporateSort = {};
        if (!!sortField && !!sortOrder) {
            sort = {
                [sortField]: parseInt(sortOrder),
            };
            console.log('Commmit Me');
        }
        const visitFilters = {};
        if (filters.startDate && filters.endDate) {
            let $gte = new Date(filters.startDate), $lte = new Date(filters.endDate);
            $gte.setHours(0, 0, 0, 0);
            $lte.setHours(23, 59, 59, 999);
            visitFilters.visitedAt = { $gte, $lte };
        }
        if (filters.pageUrl) {
            visitFilters.pageUrl = { $regex: filters.pageUrl };
            common_2.Logger.log(visitFilters);
        }
        const visiterFilters = {};
        if (filters.startDate && filters.endDate) {
            let $gte = new Date(filters.startDate), $lte = new Date(filters.endDate);
            $gte.setHours(0, 0, 0, 0);
            $lte.setHours(23, 59, 59, 999);
            visiterFilters.lastVisitedAt = { $gte, $lte };
        }
        const $skip = (parseInt(page) - 1) * parseInt(limit);
        const pipeline = [
            { $match: Object.assign(Object.assign({}, (loginAPIAccessKey && { loginAPIAccessKey })), visitFilters),
            },
            {
                $sort: { visitedAt: 1 }
            },
            {
                $group: {
                    _id: '$email',
                    email: { $first: "$email" },
                    loginAPIAccessKey: { $first: "$loginAPIAccessKey" },
                    pagesVisited: { $push: "$$ROOT" },
                },
            },
            {
                $addFields: {
                    pagesVisited: { $reverseArray: '$pagesVisited' },
                    pageVisitedAsc: '$pagesVisited'
                }
            },
            {
                $lookup: {
                    from: 'visitors',
                    let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
                    pipeline: [
                        {
                            $match: Object.assign({ $expr: {
                                    $and: [
                                        { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                                        { $eq: ["$email", "$$email"] }
                                    ]
                                } }, visiterFilters)
                        }
                    ],
                    as: 'visitor'
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$visitor", 0] }] } }
            },
            { $project: { visitor: 0 } },
            { $match: Object.assign({}, searchParams), },
            {
                $lookup: {
                    from: 'unsubscribedusers',
                    let: { email: "$email" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$clientId", id] },
                                        { $eq: ["$email", "$$email"] },
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, e1: "$email", e2: "$$email" } },
                    ],
                    as: 'unsubscribed'
                }
            },
            {
                $addFields: {
                    unsubscribed: {
                        $cond: [
                            {
                                $gt: [{ $size: "$unsubscribed" }, 0]
                            },
                            "true",
                            "false"
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'corporatedatas',
                    let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                                        { $eq: ["$email", "$$email"] }
                                    ]
                                }
                            }
                        },
                    ],
                    as: 'corporateData'
                }
            },
            {
                "$unwind": {
                    "path": "$corporateData",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $addFields: {
                    corpJobCompanyName: "$corporateData.jobCompanyName",
                }
            },
        ];
        const visitors = await this.visitService.aggregate([
            ...pipeline,
            { $sort: sort },
            { $skip },
            { $limit: parseInt(limit) },
        ]);
        const visitorsCount = await this.visitService.aggregate([
            ...pipeline,
            {
                $count: "count"
            }
        ]);
        const total = !!visitorsCount && visitorsCount.length ? visitorsCount[0].count : 0;
        return {
            docs: visitors,
            limit: parseInt(limit),
            page: parseInt(page),
            pages: Math.floor(total / parseInt(limit)),
            total
        };
    }
    async getDuplicates(deleteDuplicate) {
        const visitors = await this.visitorService.aggregate([
            {
                $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } }
            },
            {
                $match: { count: { $gt: 1 } }
            }
        ]);
        if (!!deleteDuplicate) {
            for (let visitor of visitors) {
                await this.visitorService.remove({ _id: { $in: visitor.ids.slice(1) } });
            }
        }
        return visitors;
    }
    async recorrectVisitCount(id) {
        let clientQuery = {};
        let mild = 0, warm = 0, hot = 0;
        if (!!id)
            clientQuery['_id'] = id;
        const clients = await this.clientService.findAll(clientQuery);
        const subscriptions = await this.subscriptionService.findAll();
        let clientProcessed = 0;
        for (let client of clients) {
            const apps = client.apps || [];
            if (client.isLeadProritySet) {
                let clientId = client._id;
                let leadPriorityRes = await this.leadPriorityService.findOne({ clientId });
                if (leadPriorityRes) {
                    mild = leadPriorityRes.mild;
                    warm = leadPriorityRes.warm;
                    hot = leadPriorityRes.hot;
                }
            }
            try {
                const subscription = subscriptions.find((sub) => sub._id.toString() === client.subscriptionId);
                if (!subscription)
                    continue;
                for (let app of apps) {
                    let updates = [];
                    if (app.loginAPIAccessKey) {
                        let visitorsCount = 0;
                        let visitors = await this.visitorService.findAll({ loginAPIAccessKey: app.loginAPIAccessKey }, null, 50, visitorsCount);
                        while (visitors.length) {
                            let $facet = {};
                            for (let visitor of visitors) {
                                $facet[visitor._id.toString()] = [
                                    { $match: { email: visitor.email } },
                                    { $group: { _id: "$email", count: { $sum: 1 } } },
                                ];
                            }
                            let visits = [];
                            if (Object.keys($facet).length) {
                                visits = await this.visitService.aggregate([
                                    { $facet }
                                ]);
                            }
                            updates = updates.concat(visitors.map((visitor, index) => ({
                                updateOne: {
                                    filter: { _id: visitor._id.toString() },
                                    update: Object.assign({}, (visits[0] && visits[0][visitor._id.toString()] &&
                                        visits[0][visitor._id.toString()][0] &&
                                        visits[0][visitor._id.toString()][0].count
                                        ? {
                                            visitCount: visits[0][visitor._id.toString()][0].count,
                                            priority: (client.isLeadProritySet) ?
                                                (visits[0][visitor._id.toString()][0].count <= mild) ? constant_1.LEAD_PRIORITIES.MILD :
                                                    (visits[0][visitor._id.toString()][0].count <= warm) ? constant_1.LEAD_PRIORITIES.WARM :
                                                        (visits[0][visitor._id.toString()][0].count >= hot) ? constant_1.LEAD_PRIORITIES.HOT : ''
                                                : tasks_service_1.TasksService.getLeadPriority(visits[0][visitor._id.toString()][0].count, subscription.isHotPriorityAllowed)
                                        }
                                        : {
                                            visitCount: 0,
                                            priority: (client.isLeadProritySet) ?
                                                (visits[0][visitor._id.toString()][0].count <= mild) ? constant_1.LEAD_PRIORITIES.MILD :
                                                    (visits[0][visitor._id.toString()][0].count <= warm) ? constant_1.LEAD_PRIORITIES.WARM :
                                                        (visits[0][visitor._id.toString()][0].count >= hot) ? constant_1.LEAD_PRIORITIES.HOT : ''
                                                : tasks_service_1.TasksService.getLeadPriority(0, subscription.isHotPriorityAllowed)
                                        }))
                                }
                            })));
                            visitorsCount = visitorsCount + visitors.length;
                            visitors = await this.visitorService.findAll({ loginAPIAccessKey: app.loginAPIAccessKey }, null, 50, visitorsCount);
                        }
                    }
                    await this.visitorService.bulkWrite(updates);
                }
            }
            catch (e) {
                console.log('Unknown Error', e);
            }
            console.log(`Client Processed ${++clientProcessed} of ${clients.length}`);
        }
    }
    async export(loginAPIAccessKey, filters, sortField, sortOrder, req) {
        const { id } = req.user;
        const date = new Date();
        const fileName = `./uploads/xlsx/${uuid_1.v1()}-${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}.xlsx`;
        var wb = xlsx.utils.book_new();
        filters = filters ? JSON.parse(filters) : {};
        let searchParams = this.parseFilters(filters);
        let sort = {
            lastVisitedAt: -1
        };
        if (!!sortField && !!sortOrder) {
            sort = {
                [sortField]: parseInt(sortOrder),
            };
        }
        const visitFilters = {};
        if (filters.startDate && filters.endDate) {
            let $gte = new Date(filters.startDate), $lte = new Date(filters.endDate);
            $gte.setHours(0, 0, 0, 0);
            $lte.setHours(23, 59, 59, 999);
            visitFilters.visitedAt = { $gte, $lte };
        }
        const pipeline = [
            { $match: Object.assign(Object.assign({}, (loginAPIAccessKey && { loginAPIAccessKey })), visitFilters) },
            {
                $group: {
                    _id: '$email',
                    email: { $first: "$email" },
                    loginAPIAccessKey: { $first: "$loginAPIAccessKey" },
                }
            },
            {
                $lookup: {
                    from: 'visitors',
                    let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                                        { $eq: ["$email", "$$email"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'visitor'
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$visitor", 0] }] } }
            },
            { $match: Object.assign({}, searchParams) },
            {
                $lookup: {
                    from: 'visits',
                    let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                                        { $eq: ["$email", "$$email"] }
                                    ]
                                }
                            }
                        },
                    ],
                    as: 'pagesVisited'
                }
            },
            {
                $lookup: {
                    from: 'unsubscribedusers',
                    let: { email: "$email" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$clientId", id] },
                                        { $eq: ["$email", "$$email"] },
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } },
                    ],
                    as: 'unsubscribed'
                }
            },
            {
                $project: {
                    lastVisitedAt: 1,
                    firstName: 1,
                    lastName: 1,
                    address: 1,
                    city: 1,
                    state: 1,
                    zipcode: 1,
                    Leadpriority: "$priority",
                    crmMatchDate: 1,
                    visitCount: 1,
                    email: 1,
                    dateIdentified: 1,
                    phoneNo: 1,
                    _id: 0,
                    unsubscribed: {
                        $cond: [
                            {
                                $gt: [{ $size: "$unsubscribed" }, 0]
                            },
                            "true",
                            ""
                        ]
                    },
                    emailed: {
                        $cond: [
                            { "$ne": ["$autoResponderListDate", null] },
                            "true",
                            ""
                        ]
                    },
                    pagesVisited: {
                        $reduce: {
                            input: '$pagesVisited',
                            initialValue: '',
                            in: { $concat: ["$$value", "$$this.pageUrl", " ,"] }
                        }
                    }
                }
            },
        ];
        const visitors = await this.visitService.aggregate([
            ...pipeline,
            { $sort: sort },
        ]);
        const ws = xlsx.utils.json_to_sheet([...visitors], {
            header: [
                "lastVisitedAt",
                "dateIdentified",
                "Leadpriority",
                "visitCount",
                "crmMatchDate",
                "email",
                "firstName",
                "lastName",
                "address",
                "city",
                "state",
                "zipcode",
                "phoneNo",
                "emailed",
                "unsubscribed",
                "pagesVisited",
            ]
        });
        xlsx.utils.book_append_sheet(wb, ws, 'Visitors');
        xlsx.writeFile(wb, fileName);
        return { success: 1, fileName };
    }
    async exportCrmMatchingHistory(loginAPIAccessKey, filters, sortField, sortOrder, req) {
        const { id } = req.user;
        const date = new Date();
        const companyName = req.user.companyName.split(' ').join('-');
        const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const fileName = `./uploads/xlsx/${companyName}-Stealth-Crm-Match-${date.getFullYear()}-${mons[date.getMonth()]}-${date.getDate()}.xlsx`;
        var wb = xlsx.utils.book_new();
        filters = filters ? JSON.parse(filters) : {};
        common_2.Logger.log(filters.crmMatchId);
        let matchedEmails = await this.crmMatchingHistoryService.findAll({ _id: filters.crmMatchId });
        if (matchedEmails.length == 0)
            return { success: 0, fileName };
        const emailArray = matchedEmails[0].matchedEmails.split(',');
        let sort = {
            lastVisitedAt: -1
        };
        if (!!sortField && !!sortOrder) {
            sort = {
                [sortField]: parseInt(sortOrder),
            };
        }
        const pipeline = [
            { $match: Object.assign({}, (loginAPIAccessKey && { loginAPIAccessKey })) },
            {
                $group: {
                    _id: '$email',
                    email: { $first: "$email" },
                    loginAPIAccessKey: { $first: "$loginAPIAccessKey" },
                }
            },
            {
                $lookup: {
                    from: 'visitors',
                    let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                                        { $eq: ["$email", "$$email"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'visitor'
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$visitor", 0] }] } }
            },
            { $match: { $expr: { $in: ["$email", emailArray] } } },
            {
                $lookup: {
                    from: 'visits',
                    let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                                        { $eq: ["$email", "$$email"] }
                                    ]
                                }
                            }
                        },
                    ],
                    as: 'pagesVisited'
                }
            },
            {
                $lookup: {
                    from: 'unsubscribedusers',
                    let: { email: "$email" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$clientId", id] },
                                        { $eq: ["$email", "$$email"] },
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } },
                    ],
                    as: 'unsubscribed'
                }
            },
            {
                $project: {
                    lastVisitedAt: 1,
                    firstName: 1,
                    lastName: 1,
                    address: 1,
                    city: 1,
                    state: 1,
                    zipcode: 1,
                    Leadpriority: "$priority",
                    crmMatchDate: 1,
                    visitCount: 1,
                    email: 1,
                    dateIdentified: 1,
                    phoneNo: 1,
                    _id: 0,
                    unsubscribed: {
                        $cond: [
                            {
                                $gt: [{ $size: "$unsubscribed" }, 0]
                            },
                            "true",
                            ""
                        ]
                    },
                    emailed: {
                        $cond: [
                            { "$ne": ["$autoResponderListDate", null] },
                            "true",
                            ""
                        ]
                    },
                    pagesVisited: {
                        $reduce: {
                            input: '$pagesVisited',
                            initialValue: '',
                            in: { $concat: ["$$value", "$$this.pageUrl", " ,"] }
                        }
                    }
                }
            },
        ];
        const visitors = await this.visitService.aggregate([
            ...pipeline,
            { $sort: sort },
        ]);
        const ws = xlsx.utils.json_to_sheet([...visitors], {
            header: [
                "lastVisitedAt",
                "dateIdentified",
                "Leadpriority",
                "visitCount",
                "crmMatchDate",
                "email",
                "firstName",
                "lastName",
                "address",
                "city",
                "state",
                "zipcode",
                "phoneNo",
                "emailed",
                "unsubscribed",
                "pagesVisited",
            ]
        });
        xlsx.utils.book_append_sheet(wb, ws, 'Visitors');
        xlsx.writeFile(wb, fileName);
        return { success: 1, fileName };
    }
    async crmUpload(file, req) {
        const bulkUploadValidator = new CrmValidator_1.default();
        let emails = [];
        let errors = [];
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        else {
            try {
                const RawExcel = xlsx.read(file.buffer, { cellDates: true });
                const RawData = xlsx.utils.sheet_to_json(RawExcel.Sheets.Sheet1);
                let counter = 0;
                for (let data of RawData) {
                    const validationResult = bulkUploadValidator.validate(data);
                    if (validationResult.isValid) {
                        emails.push(data['email'].toLowerCase());
                    }
                    else {
                        errors.push({
                            row: counter,
                            errors: validationResult.errors
                        });
                    }
                    counter++;
                }
                emails.length && await this.visitorService.updateMany({ email: { $in: emails }, $or: [{ crmMatchDate: { $eq: null } }, { crmMatchDate: { $exists: false } }] }, { crmMatchDate: new Date() });
                let matchedvisitors = await this.visitorService.findAll({ email: { $in: emails } });
                let $matchedcount = matchedvisitors.length;
                const matchedemails = matchedvisitors.map(mv => {
                    return mv.email;
                });
                let $matchedEmails = matchedemails.join(',');
                common_2.Logger.log($matchedEmails);
                let $date = new Date();
                let $uploaddt = new Date();
                let $isdeleted = false;
                let $fileName = file.originalname;
                let $totalRecords = emails.length;
                let $filePath = `./uploads/xlsx/${uuid_1.v1()}-${$date.getMonth() + 1}-${$date.getDate()}-${$date.getFullYear()}.xlsx`;
                let $uid = req.user.id;
                const crmMatchingHistory = await this.crmMatchingHistoryService.create(Object.assign(Object.assign({}, crmmatchinghistory_dto_1.CreateCrmMatchingHistoryDto), { crmMatched: $matchedcount, fileName: $fileName, filePath: $filePath, matchedEmails: $matchedEmails, totalRecords: $totalRecords, uploadDate: $uploaddt, isDeleted: $isdeleted, uID: $uid }));
                const tabledata = await this.crmMatchingHistoryService.findAll({ uID: req.user.id });
                return {
                    tabledata,
                    status: !errors.length,
                    errors
                };
            }
            catch (err) {
                console.log('ERROR', `bulkUpload`, err);
                throw new common_1.InternalServerErrorException('Internal Server Error');
            }
        }
    }
    async crmMatchingHistory(req) {
        let errors = [];
        try {
            const tabledata = await this.crmMatchingHistoryService.findAll({ uID: req.user.id });
            return {
                tabledata,
                status: !errors.length,
                errors
            };
        }
        catch (err) {
            console.log('ERROR', `crmMatchingHistory`, err);
            throw new common_1.InternalServerErrorException('Internal Server Error');
        }
    }
    async deleteCrmMatchingFile(req, crmMatchId) {
        let errors = [];
        try {
            common_2.Logger.log(crmMatchId);
            const result = await this.crmMatchingHistoryService.delete(crmMatchId);
            return {
                result,
                status: !errors.length,
                errors
            };
        }
        catch (err) {
            console.log('ERROR', `crmMatchingHistory`, err);
            throw new common_1.InternalServerErrorException('Internal Server Error');
        }
    }
    task(startDate, endDate) {
        this.taskService.handleCron(Object.assign({}, (!!startDate && !!endDate ? { startDate, endDate } : {})));
    }
    syncReports() {
        this.taskService.processReports();
    }
    getPeoplesData(email) {
        let params = { 'email': email };
        this.taskService.testPeoplesData(params);
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('page')),
    __param(1, common_1.Query('limit')),
    __param(2, common_1.Query('sortField')),
    __param(3, common_1.Query('sortOrder')),
    __param(4, common_1.Query('loginAPIAccessKey')),
    __param(5, common_1.Query('filters')),
    __param(6, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "findAll", null);
__decorate([
    common_1.Get('/duplicates'),
    __param(0, common_1.Query('deleteDuplicate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "getDuplicates", null);
__decorate([
    common_1.Get('/recorrectVisitCount'),
    __param(0, common_1.Query('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "recorrectVisitCount", null);
__decorate([
    common_1.Get('export'),
    __param(0, common_1.Query('loginAPIAccessKey')),
    __param(1, common_1.Query('filters')),
    __param(2, common_1.Query('sortField')),
    __param(3, common_1.Query('sortOrder')),
    __param(4, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "export", null);
__decorate([
    common_1.Get('exportCrmMatchingHistory'),
    __param(0, common_1.Query('loginAPIAccessKey')),
    __param(1, common_1.Query('filters')),
    __param(2, common_1.Query('sortField')),
    __param(3, common_1.Query('sortOrder')),
    __param(4, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "exportCrmMatchingHistory", null);
__decorate([
    common_1.Post('/crmMatching'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file')),
    __param(0, common_1.UploadedFile()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "crmUpload", null);
__decorate([
    common_1.Post('/crmMatchingHistory'),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "crmMatchingHistory", null);
__decorate([
    common_1.Get('/deleteCrmMatchingFile'),
    __param(0, common_1.Request()), __param(1, common_1.Query('crmMatchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VisitorController.prototype, "deleteCrmMatchingFile", null);
__decorate([
    common_1.Get('/task'),
    __param(0, common_1.Query('startDate')),
    __param(1, common_1.Query('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VisitorController.prototype, "task", null);
__decorate([
    common_1.Get('/sync-reports'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VisitorController.prototype, "syncReports", null);
__decorate([
    common_1.Get('/peoples-data'),
    __param(0, common_1.Query('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VisitorController.prototype, "getPeoplesData", null);
VisitorController = __decorate([
    common_1.Controller('visitor'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [visitor_service_1.VisitorService,
        visit_service_1.VisitService,
        tasks_service_1.TasksService,
        client_service_1.ClientService,
        subscription_service_1.SubscriptionService,
        crmmatchinghistory_service_1.CrmMatchingHistoryService,
        leadpriority_service_1.LeadPriorityService])
], VisitorController);
exports.VisitorController = VisitorController;
//# sourceMappingURL=visitor.controller.js.map