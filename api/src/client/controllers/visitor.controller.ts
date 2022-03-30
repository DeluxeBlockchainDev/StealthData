import { BadRequestException, Controller, Get, InternalServerErrorException, Post, Param, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { TasksService } from '../services/tasks.service';
import { VisitService } from '../services/visit.service';
import { VisitorService } from '../services/visitor.service';
import * as xlsx from 'xlsx';
import CrmUploadValidator from '../validators/CrmValidator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientService } from '../services/client.service';
import { LeadPriorityService } from '../services/leadpriority.service';
import { LEAD_PRIORITIES } from '../constant';
import { v1 as uuidv1 } from 'uuid';
import { SubscriptionService } from '../services/subscription.service';
import { CrmMatchingHistoryService } from '../services/crmmatchinghistory.service';
import { CreateCrmMatchingHistoryDto } from '../dto/crmmatchinghistory.dto';
import * as flatten from 'lodash.flatten';
import { PaginateResult } from 'mongoose';
import { diskStorage } from 'multer';
import { Logger } from '@nestjs/common';
@Controller('visitor')
@UseGuards(JwtAuthGuard)
export class VisitorController {

  constructor(
    private visitorService: VisitorService,
    private visitService: VisitService,
    private taskService: TasksService,
    private clientService: ClientService,
    private subscriptionService: SubscriptionService,
    private crmMatchingHistoryService: CrmMatchingHistoryService,
    private leadPriorityService: LeadPriorityService
  ) { }

  parseFilters = (filters) => {
    let searchParams: any = {};

    if (!!filters.searchText) {
      searchParams.$or = [
        ...flatten(
          filters.searchText.split(' ').map((text) => [
            { email: { $regex: new RegExp(filters.searchText, 'i') } },
            { firstName: { $regex: new RegExp(text, 'i') } },
            { lastName: { $regex: new RegExp(filters.searchText, 'i') } },
          ])
        )
      ];
    }

    if (!!filters.leadPriority) {
      searchParams.priority = filters.leadPriority
    }

    if (!!filters.crmMatchDate) {
      searchParams.crmMatchDate = {
        $exists: true,
        ...(
          filters.crmMatchDate === 'true' ?
            { $ne: null } :
            { $eq: null }
        )
      };
    }
    return searchParams;
  }

  // export 
  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Query('loginAPIAccessKey') loginAPIAccessKey,
    @Query('filters') filters: any,
    @Request() req
  ): Promise<PaginateResult<any>> {
    const { id } = req.user;
    filters = filters ? JSON.parse(filters) : {};
    let searchParams: any = this.parseFilters(filters);
    console.log('searchParams: ',searchParams)
    let sort: any = {
      lastVisitedAt: -1
    };
    let corporateSort: any = {};

    if (!!sortField && !!sortOrder) {
      sort = {
        [sortField]: parseInt(sortOrder),
      }
      console.log('Commmit Me');
    }
    
    const visitFilters: any = {};

    if (filters.startDate && filters.endDate) {
      let $gte = new Date(filters.startDate), $lte = new Date(filters.endDate);
      $gte.setHours(0, 0, 0, 0); $lte.setHours(23, 59, 59, 999);
      visitFilters.visitedAt = { $gte, $lte };
    }
    if (filters.pageUrl) {
      visitFilters.pageUrl = { $regex: filters.pageUrl };
      Logger.log(visitFilters);
    }
    const visiterFilters: any = {};
    if (filters.startDate && filters.endDate) {
      let $gte = new Date(filters.startDate), $lte = new Date(filters.endDate);
      $gte.setHours(0, 0, 0, 0); $lte.setHours(23, 59, 59, 999);
      visiterFilters.lastVisitedAt = { $gte, $lte };
    }
    
    const $skip = (parseInt(page) - 1) * parseInt(limit);
    const pipeline = [
      { $match: { 
        ...(loginAPIAccessKey && { loginAPIAccessKey }), ...visitFilters, 
      },
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
              $match:
              {
                $expr:
                {
                  $and:
                    [
                      { $eq: ["$loginAPIAccessKey", "$$loginAPIAccessKey"] },
                      { $eq: ["$email", "$$email"] }
                    ]
                },
                ...visiterFilters
              }
            }
          ],
          as: 'visitor'
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$visitor", 0] }] } }
      },
      { $project: { visitor: 0 } },
      { $match: { ...searchParams }, },
      {
        $lookup: {
          from: 'unsubscribedusers',
          let: { email: "$email" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
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
              $match:
              {
                $expr:
                {
                  $and:
                    [
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

    const visitors: any = await this.visitService.aggregate([
      ...pipeline,
      { $sort: sort },
      { $skip },
      { $limit: parseInt(limit) },
    ]);

    const visitorsCount: any = await this.visitService.aggregate([
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

  @Get('/duplicates')
  async getDuplicates(@Query('deleteDuplicate') deleteDuplicate) {
    const visitors = await this.visitorService.aggregate([
      {
        $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ])
    if (!!deleteDuplicate) {
      for (let visitor of visitors) {
        await this.visitorService.remove({ _id: { $in: visitor.ids.slice(1) } });
      }
    }
    return visitors;
  }



  @Get('/recorrectVisitCount')
  async recorrectVisitCount(@Query('id') id) {
    let clientQuery = {};
    let mild = 0, warm = 0, hot = 0;
    if (!!id) clientQuery['_id'] = id;

    const clients = await this.clientService.findAll(clientQuery);
    const subscriptions = await this.subscriptionService.findAll();
    let clientProcessed = 0;
    
    for (let client of clients) {

      const apps = client.apps || [];

      //get custom lead priority

      if(client.isLeadProritySet) {
        
        let clientId = client._id;

        let leadPriorityRes = await this.leadPriorityService.findOne({clientId});

        if(leadPriorityRes) {
          
          mild = leadPriorityRes.mild;
          warm = leadPriorityRes.warm;
          hot = leadPriorityRes.hot;

        }

      }

      try {
        const subscription = subscriptions.find((sub) => sub._id.toString() === client.subscriptionId);
        if (!subscription) continue; // is client has no subscription then dont process;

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
                ]
              }

              let visits = [];
              if (Object.keys($facet).length) {
                visits = await this.visitService.aggregate([
                  { $facet }
                ])
              }

              updates = updates.concat(
                visitors.map(
                   (visitor, index) => ({
                    updateOne: {
                      filter: { _id: visitor._id.toString() },
                      update: {
                        ...(
                              visits[0] && visits[0][visitor._id.toString()] && 
                              visits[0][visitor._id.toString()][0] && 
                              visits[0][visitor._id.toString()][0].count
                            ? { 
                                visitCount: visits[0][visitor._id.toString()][0].count, 
                                priority: (client.isLeadProritySet) ?
                                (visits[0][visitor._id.toString()][0].count <= mild) ? LEAD_PRIORITIES.MILD :
                                (visits[0][visitor._id.toString()][0].count <= warm) ? LEAD_PRIORITIES.WARM :
                                (visits[0][visitor._id.toString()][0].count >= hot) ? LEAD_PRIORITIES.HOT : ''
                                : TasksService.getLeadPriority(visits[0][visitor._id.toString()][0].count, subscription.isHotPriorityAllowed) 
                              }
                            : { 
                                visitCount: 0, 
                                priority: (client.isLeadProritySet) ?
                                (visits[0][visitor._id.toString()][0].count <= mild) ? LEAD_PRIORITIES.MILD :
                                (visits[0][visitor._id.toString()][0].count <= warm) ? LEAD_PRIORITIES.WARM :
                                (visits[0][visitor._id.toString()][0].count >= hot) ? LEAD_PRIORITIES.HOT : ''
                                : TasksService.getLeadPriority(0, subscription.isHotPriorityAllowed) 
                              }
                        )
                      }
                    }
                  })
                )
              );
              visitorsCount = visitorsCount + visitors.length;
              visitors = await this.visitorService.findAll({ loginAPIAccessKey: app.loginAPIAccessKey }, null, 50, visitorsCount)
            }

          }
          
          await this.visitorService.bulkWrite(updates);
        }
      } catch (e) {
        console.log('Unknown Error', e)
      }
      console.log(`Client Processed ${++clientProcessed} of ${clients.length}`);
    }
  }

  @Get('export')
  async export(
    @Query('loginAPIAccessKey') loginAPIAccessKey,
    @Query('filters') filters: any,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Request() req
  ) {
    const { id } = req.user;

    const date = new Date();
    const fileName = `./uploads/xlsx/${uuidv1()}-${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}.xlsx`;
    var wb = xlsx.utils.book_new();

    filters = filters ? JSON.parse(filters) : {};
    let searchParams: any = this.parseFilters(filters);
    let sort: any = {
      lastVisitedAt: -1
    };
    if (!!sortField && !!sortOrder) {
      sort = {
        [sortField]: parseInt(sortOrder),
      }
    }

    const visitFilters: any = {};
    if (filters.startDate && filters.endDate) {
      let $gte = new Date(filters.startDate), $lte = new Date(filters.endDate);
      $gte.setHours(0, 0, 0, 0); $lte.setHours(23, 59, 59, 999);
      visitFilters.visitedAt = { $gte, $lte };
    }

    const pipeline = [
      { $match: { ...(loginAPIAccessKey && { loginAPIAccessKey }), ...visitFilters } },
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
              $match:
              {
                $expr:
                {
                  $and:
                    [
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
      { $match: { ...searchParams } },
      {
        $lookup: {
          from: 'visits',
          let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
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
              $match:
              {
                $expr:
                {
                  $and:
                    [
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

    const visitors: any = await this.visitService.aggregate([
      ...pipeline,
      { $sort: sort },
    ]);
    const ws = xlsx.utils.json_to_sheet(
      [...visitors],
      {
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
      }
    );
    xlsx.utils.book_append_sheet(wb, ws, 'Visitors');
    xlsx.writeFile(wb, fileName);
    return { success: 1, fileName };
  }

  @Get('exportCrmMatchingHistory')
  async exportCrmMatchingHistory(
    @Query('loginAPIAccessKey') loginAPIAccessKey,
    @Query('filters') filters: any,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
    @Request() req
  ) {

    const { id } = req.user;
    const date = new Date();
    const companyName = req.user.companyName.split(' ').join('-');
    const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    //const fileName = `./uploads/xlsx/${companyName}-Stealth-Crm-Match-${date.toLocaleDateString(undefined, {year:'numeric',month:'long',day:'numeric'})}.xlsx`;
    const fileName = `./uploads/xlsx/${companyName}-Stealth-Crm-Match-${date.getFullYear()}-${mons[date.getMonth()]}-${date.getDate()}.xlsx`;

  
    var wb = xlsx.utils.book_new();

    filters = filters ? JSON.parse(filters) : {};
    Logger.log(filters.crmMatchId);

    let matchedEmails = await this.crmMatchingHistoryService.findAll({_id:filters.crmMatchId});
    if(matchedEmails.length==0) return { success: 0, fileName };
    const emailArray = matchedEmails[0].matchedEmails.split(',');
    //Logger.log(typeof emailArray);

    //let searchParams: any = this.parseFilters(filters);
    let sort: any = {
      lastVisitedAt: -1
    };
    if (!!sortField && !!sortOrder) {
      sort = {
        [sortField]: parseInt(sortOrder),
      }
    }

    const pipeline = [
      { $match: { ...(loginAPIAccessKey && { loginAPIAccessKey }) } },
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
              $match:
              {
                $expr:
                {
                  $and:
                    [
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
      { $match: { $expr:{$in: ["$email", emailArray]} } },
      {
        $lookup: {
          from: 'visits',
          let: { email: "$email", loginAPIAccessKey: "$loginAPIAccessKey" },
          pipeline: [
            {
              $match:
              {
                $expr:
                {
                  $and:
                    [
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
              $match:
              {
                $expr:
                {
                  $and:
                    [
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
    const visitors: any = await this.visitService.aggregate([
      ...pipeline,
      { $sort: sort },
    ]);
    const ws = xlsx.utils.json_to_sheet(
      [...visitors],
      {
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
      }
    );
    xlsx.utils.book_append_sheet(wb, ws, 'Visitors');
    xlsx.writeFile(wb, fileName);
    return { success: 1, fileName };
  }

  @Post('/crmMatching')
  @UseInterceptors(FileInterceptor('file')
    /*
    , {
        storage: diskStorage({
          destination: './uploads/xlsx',
        }),
      }
      */
  )
  async crmUpload(
    @UploadedFile() file,
    @Request() req) {

    const bulkUploadValidator = new CrmUploadValidator();
    let emails = [];
    let errors = [];

    if (!file) {
      throw new BadRequestException('File is required')
    } else {
      try {
        const RawExcel = xlsx.read(file.buffer, { cellDates: true });
        const RawData = xlsx.utils.sheet_to_json(RawExcel.Sheets.Sheet1);
        let counter = 0;

        for (let data of RawData) {
          const validationResult = bulkUploadValidator.validate(data);
          if (validationResult.isValid) {
            emails.push(data['email'].toLowerCase());
          } else {
            errors.push({
              row: counter,
              errors: validationResult.errors
            })
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
        Logger.log($matchedEmails);
        let $date = new Date();
        let $uploaddt = new Date();
        let $isdeleted = false;
        let $fileName = file.originalname;
        let $totalRecords = emails.length;
        let $filePath = `./uploads/xlsx/${uuidv1()}-${$date.getMonth() + 1}-${$date.getDate()}-${$date.getFullYear()}.xlsx`;
        let $uid = req.user.id;

        const crmMatchingHistory = await this.crmMatchingHistoryService.create({ ...CreateCrmMatchingHistoryDto, crmMatched: $matchedcount, fileName: $fileName, filePath: $filePath, matchedEmails:$matchedEmails, totalRecords: $totalRecords, uploadDate: $uploaddt, isDeleted: $isdeleted, uID: $uid });
        //let tabledata = this.crmMatchingHistoryService.findAll({fileName:"test.xlsx"});
        const tabledata = await this.crmMatchingHistoryService.findAll({uID:req.user.id});
        return {
          tabledata,
          status: !errors.length,
          errors
        }
      } catch (err) {
        console.log('ERROR', `bulkUpload`, err);
        throw new InternalServerErrorException('Internal Server Error')
      }
    }
  }

  @Post('/crmMatchingHistory')
  async crmMatchingHistory(
    @Request() req
  ) {

    let errors = [];
    try {
      const tabledata = await this.crmMatchingHistoryService.findAll({uID:req.user.id});
      return {
        tabledata,
        status: !errors.length,
        errors
      }
    } catch (err) {
      console.log('ERROR', `crmMatchingHistory`, err);
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  @Get('/deleteCrmMatchingFile')
  async deleteCrmMatchingFile(
    @Request() req, @Query('crmMatchId') crmMatchId: string
  ) {

    let errors = [];
    try {
      Logger.log(crmMatchId);
      const result = await this.crmMatchingHistoryService.delete(crmMatchId);
      return {
        result,
        status: !errors.length,
        errors
      }
    } catch (err) {
      console.log('ERROR', `crmMatchingHistory`, err);
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  @Get('/task')
  task(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    this.taskService.handleCron({ ...(!!startDate && !!endDate ? { startDate, endDate } : {}) })
  }

  @Get('/sync-reports')
  syncReports() {
    this.taskService.processReports()
  }

  @Get('/peoples-data')
  getPeoplesData(@Query('email') email: string) {
    let params = { 'email': email };
    this.taskService.testPeoplesData(params)
  }
}