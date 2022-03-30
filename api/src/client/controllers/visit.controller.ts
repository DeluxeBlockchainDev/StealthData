import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { VisitService } from '../services/visit.service';


@Controller('visit')
@UseGuards(JwtAuthGuard)
export class VisitController {
  
  constructor(private visitService: VisitService){}

  @Get()
  async findAll(@Query('offset') offset: string, @Query('limit') limit: string, @Query('email') email: string, @Query('pageUrl') pageUrl: string, @Query('loginAPIAccessKey') loginAPIAccessKey) {
    const visits:any = await this.visitService.paginate( parseInt(offset), parseInt(limit), { ...( loginAPIAccessKey ? { loginAPIAccessKey } : {} ), ...( email ? { email } : {} ), ...(pageUrl? {pageUrl:{$regex:new RegExp(pageUrl, "i")}} : {})});
    return visits;
  }
}