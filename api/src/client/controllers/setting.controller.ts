import { Controller, Get, Post, Query, Request, InternalServerErrorException, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { UrlTrackingConfigService } from '../services/urltrackingconfig.service';
import { CreateUrlTrackingConfigDto } from '../dto/urltrackingconfig.dto';

@Controller('setting')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(private urlTrackingConfigService: UrlTrackingConfigService) {}
  @Post('/loadTrackingUrls')
  async loadTrackingUrls(
    @Request() req
  ) {

    let errors = [];
    try {
      const tabledata = await this.urlTrackingConfigService.findAll({uId:req.user.id});
      return {
        tabledata,
        status: !errors.length,
        errors
      }
    } catch (err) {
      console.log('ERROR', `urlTrackingConfig`, err);
      throw new InternalServerErrorException('Internal Server Error')
    }

  }
  @Post('/filterTrackingURLs')
  async filterTrackingURLs(
    @Request() req
  ) {

    let errors = [];
    try {
      const tabledata = await this.urlTrackingConfigService.findAll({uId:req.user.id, status:true});
      return {
        tabledata,
        status: !errors.length,
        errors
      }
    } catch (err) {
      console.log('ERROR', `urlTrackingConfig`, err);
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  @Post('/updateUrlSetting')
  async updateUrlSetting(
    //@Query('id') id: string,
    //@Query('params') params: any,
    //@Query('currentUrl') currentUrl: string,
    @Request() req
  ) {
    Logger.log(req.body);
    let errors = [];
    try {
      if(req.body.id==null) {
        //create
        const res = await this.urlTrackingConfigService.create({url: req.body.url, createdAt: new Date(), status: true, uId: req.user.id});
        return {
          res,
          status: !errors.length,
          errors
        }
      } else {
        //update
        const res = await this.urlTrackingConfigService.findOneAndUpdate(req.body.id, req.body);
        return {
          res,
          status: !errors.length,
          errors
        }
      }

    } catch (err) {
      console.log('ERROR', `urlTrackingConfig`, err);
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  
  @Get('/deleteUrlSetting')
  async deleteUrlSetting(
    @Request() req, @Query('urlId') urlId: string
  ) {

    let errors = [];
    try {
      Logger.log(urlId);
      const result = await this.urlTrackingConfigService.delete(urlId);
      return {
        result,
        status: !errors.length,
        errors
      }
    } catch (err) {
      console.log('ERROR', `TrackingUrlSetting`, err);
      throw new InternalServerErrorException('Internal Server Error')
    }
  }
}