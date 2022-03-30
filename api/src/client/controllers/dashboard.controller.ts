import { Body, Controller, Delete, Get, Request, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { VisitService } from '../services/visit.service';
import { VisitorService } from '../services/visitor.service';
import * as uniqBy from 'lodash.uniqby';
import { CampaignStatService } from '../services/campaign-stat.service';
import * as xlsx from 'xlsx';
import * as Client from 'ftp';
import * as fs from 'fs';
import { UnsubscribedUserService } from '../services/unsubscribed-user.service';
import { ClientService } from '../services/client.service';



@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  
  constructor(
    private visitService: VisitService,
    private visitorService: VisitorService,
    private campaignStatService: CampaignStatService,
    private unsubscribedUserService: UnsubscribedUserService,
    private clientService: ClientService,
  ){}

  @Get('/topVisitors')
  async getTopVisitors(@Query('filters') filters: any, @Query('loginAPIAccessKey') loginAPIAccessKey ) {

    filters = filters ? JSON.parse(filters): {};

    const today = new Date();
    const startDate = new Date( today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), 1 );
    const endDate = new Date( today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), 31 );

    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,0);

    const result = await this.visitService.aggregate([
      {
        $match: {
          visitedAt: { $gte: startDate, $lte: endDate },
          loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
        }
      },
      {
        $group : { _id: "$email", count: { $sum: 1 } }
      },
      {
        $sort : { count: -1 }
      },
      {
        $limit: 7
      }
    ])

    let topVisitors:any = await this.visitorService.findAll({ email: { $in : result.map((a) => a._id) }, loginAPIAccessKey: { $eq: loginAPIAccessKey || '' } });
    topVisitors = uniqBy(topVisitors, 'email').map((v) =>
    {
      const _v = result.find((r) => r._id === v.email);
      return _v ? { ...v._doc, monthlyVisitCount: _v.count } : v._doc;
    }).sort((a,b) => b.monthlyVisitCount - a.monthlyVisitCount);
    return topVisitors;
  }

  processFileManual({ stream, fileName, clientMap, destDir, crDate }, onDownload) {
    const campaignStatsWrite = [];
    const unsubscribedUserWrite = [];
    stream.pipe(fs.createWriteStream(`${destDir}/${fileName}`))
    stream.once('close', () => {
      console.log('Downloaded',`${destDir}/${fileName}`)
      const reportData = xlsx.readFile(`${destDir}/${fileName}`, { cellDates: true });
      let jsonStream = xlsx.stream.to_json(reportData['Sheets']['Sheet1'], {raw:true});

      if( fileName.includes('message_stats_daily') ) {
        jsonStream.on('data', (row) => {
          let clientId = clientMap.get(row.campaign_name.substring(2));

          if(!!clientId) {
            campaignStatsWrite.push({
              insertOne: {
                document: {
                  messageId: row.message_id, 
                  campaignId: row.campaign_id,
                  uniqueOpenRate: row.unique_open_rate,
                  clickRate: row.click_rate,
                  linksClicked : row.unique_links_clicked,
                  uniqueClickRate: row.unique_click_rate, 
                  totalEmailsSent: row.total_emails_sent,
                  emailsSent: row.emails_sent,
                  emailsDelivered : row.emails_delivered,
                  emailsOpened : row.unique_opens,
                  campaignName: row.campaign_name,
                  unsubscribeRate: row.unsubscribe_rate,
                  totalUnsubscribed : row.unsubscribed,
                  clientId,
                  fileName,
                  createdAt:crDate
                }
              }
            })
          }
        })
        jsonStream.on('end', () => {
          console.log('campaignStatsWrite', campaignStatsWrite.length );

          campaignStatsWrite && campaignStatsWrite.length &&  
          this.campaignStatService.bulkWrite(campaignStatsWrite)

        });
      } else if( fileName.includes('removed_contacts_daily') ) {
        jsonStream.on('data', (row) => {
          let clientId = clientMap.get(row.list_name.substring(2));
          if(!!clientId && row.delete_time) {
            unsubscribedUserWrite.push({
              insertOne: {
                document: {
                  deletedAt: row.delete_time,
                  email: row.email,
                  campaignName: row.list_name,
                  clientId,
                  fileName,
                  createdAt : crDate
                }
              }
            })
          }
        });
      
        jsonStream.on('end', () => {
          console.log('unsubscribedUserWrite', unsubscribedUserWrite.length );

          unsubscribedUserWrite && unsubscribedUserWrite.length &&
          this.unsubscribedUserService.bulkWrite(unsubscribedUserWrite)
        });
      }
      onDownload({ fileName });
    })
  }

  @Get('/manualEntry')
  async test(@Query('dateString') dateString: any) {
    try{
      let crDate = new Date(dateString);
      crDate.setDate(crDate.getDate() + 1)
      dateString = dateString.replace(/\\|\//g,'');
      const clients = await this.clientService.findAll();
      const clientMap = new Map();
      for(let client of clients) clientMap.set( client.companyName.replace(/ /g,'').toLowerCase(), client._id );
      const destDir = `${process.cwd()}/../../dest`;
      const client = new Client();
      client.on('ready', () => {  
        client.list('reports/', async (err, list) => {
          if (err) {
            console.log(err) 
          } else {
            console.log('dateString', dateString);
            console.log('sv...',`message_stats_daily_${dateString}`);
            const filteredFiles = list.filter((file) => file.name.includes(`message_stats_daily_${dateString}`) || file.name.includes(`removed_contacts_daily_${dateString}`) );
            let downloadedFilesCount = 0, existingFilesCount = 0;
            if(!filteredFiles.length) {
              console.log('No file available to download');
              client.end();
            } else {
              for(let file of filteredFiles) {
                const fileName = file.name;
                const existingFileQuery = fileName.includes(`message_stats_daily_${dateString}`) 
                  ? this.campaignStatService.findAll({ fileName })
                  : fileName.includes(`removed_contacts_daily_${dateString}`)
                  ? this.unsubscribedUserService.findAll({ fileName }) : null;
                const existingFile = await existingFileQuery;
                if(existingFile && !existingFile.length) {
                  console.log('Downloading File');
                  client.get(
                    `reports/${fileName}`, 
                    (err, stream) => {
                      if(err) {
                        console.log('Error While Downloading File', fileName)
                      } else {
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
                        })
                      }
                  });
                } else {
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
    } catch (e) {
      console.log(e);
    }
  }
  

  @Get('/leadPriority')
  async getLeadPriority(@Query('loginAPIAccessKey') loginAPIAccessKey) {

    const today = new Date();
    const startDate = new Date( today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0 );
    const endDate = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0 );

    const result = await this.visitorService.aggregate([
      {
        $match: {
          lastVisitedAt: { $gte: startDate, $lte: endDate },
          loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
        }
      },
      {
        $group : { _id: "$priority", count: { $sum: 1 } }
      },
    ])

    return result;
  }

  @Get('/visitorStats')
  async getVisitorStats(@Query('loginAPIAccessKey') loginAPIAccessKey) {

    const weekdays = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thurs",
      "Fri",
      "Sat",
    ]
    const today = new Date();
    const startDate = new Date( today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0 );
    const endDate = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0 );

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
        $group: { _id : "$email", visitedAt: { $first: "$visitedAt" } },
      },
      {
        $group : { _id: { $dayOfYear: "$visitedAt"}, visitedAt: { $first: "$visitedAt" }, count: { $sum: 1 } }
      }
    ])
    
    const dailyVisitorData = [];
    for( let i = 0; i < endDate.getDate(); i ++) {
      let _date = new Date();
      _date.setDate(1 + i);
      const dat = result.find((d) => new Date(d.visitedAt).toLocaleDateString() === _date.toLocaleDateString());
      dat ? dailyVisitorData.push({ label: weekdays[_date.getDay()], count: dat.count }) : dailyVisitorData.push({ label: weekdays[_date.getDay()], count: 0 });
    }

    return { totalVisitorsIdentified, totalVisitors, dailyVisitorData, totalCrmMatched };
  }

  @Get('/topUrls')
  async getTopUrls(@Query('filters') filters: any, @Query('loginAPIAccessKey') loginAPIAccessKey ) {

    filters = filters ? JSON.parse(filters): {};
    const today = new Date();
    let startDate = new Date()
    let endDate = new Date();

    switch(filters.type) {
      case 'month':
        startDate = new Date( today.getFullYear(), today.getMonth(), 1 )
        endDate = new Date( today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), 31 );
      break;
      case 'week':
        const startOfWeek = today.getDate() - today.getDay();
        const endOfWeek = startOfWeek + 7;
        startDate = new Date( today.getFullYear(), today.getMonth(), startOfWeek )
        endDate = new Date( today.getFullYear(), filters.month !== null && filters.month !== undefined ? parseInt(filters.month) : today.getMonth(), endOfWeek );
      break;
      default:
      break;
    }

    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,0);

    const result = await this.visitService.aggregate([
      {
        $match: {
          visitedAt: { $gte: startDate, $lte: endDate },
          loginAPIAccessKey: { $eq: loginAPIAccessKey || '' }
        }
      },
      {
        $group : { _id: "$pageUrl", email: { $last : "$email" }, count: { $sum: 1 } }
      },
      {
        $sort : { count: -1 }
      },
      {
        $limit: 5
      }
    ])

    return result;
  }

  @Get('/emailStats')
  async getEmailStats( @Request() req ) {
    const { id } = req.user;
   
    const today = new Date();
    const startDate = new Date( today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0 );
    const endDate = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 0 );
    console.log('startDate', startDate)
    console.log('endDate', endDate)
    let result = await this.campaignStatService.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          clientId: { $eq: id }
        }
      },
      {
        $group: { _id : "$clientId", countPercentage: { $sum: 1 }, totalUniqueOpenRate: { $sum: "$uniqueOpenRate" }, 
        totalClickRate: { $sum: "$uniqueClickRate" }, totalUnsubscribeRate: { $sum: "$unsubscribeRate" }, 
        totalEmailsSent: { $last: "$totalEmailsSent" }, emailsSent : { $sum: "$emailsSent" },
        emailsDelivered : { $sum: "$emailsDelivered" }, emailsOpened : { $sum: "$emailsOpened" },
        totalUnsubscribed : { $sum: "$totalUnsubscribed" }, linksClicked : { $sum: "$linksClicked" } },
      },
      {
        $project : { 
          opened: { $divide : ["$totalUniqueOpenRate", "$countPercentage"]},
          clicked: { $divide : ["$totalClickRate", "$countPercentage"]},
          unsubscribed: { $divide : ["$totalUnsubscribeRate", "$countPercentage"]},
          emailsSent: "$totalEmailsSent",
          monthlyEmailsSent : "$emailsSent",
          emailsDelivered : "$emailsDelivered",
          emailsOpened : "$emailsOpened",
          totalUnsubscribed : "$totalUnsubscribed",
          linksClicked : "$linksClicked"
        }
      }
    ])
    return { ...( result && result[0] ) ? { ...result[0] } : { opened: 0, clicked: 0, unsubscribed: 0 }  };
  }

}