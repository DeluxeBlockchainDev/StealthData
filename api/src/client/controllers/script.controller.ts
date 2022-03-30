import { Controller, Get, Param } from '@nestjs/common';
import { StealthService } from 'src/common/services/stealth.service';
@Controller('ct')
export class ScriptController {
  
  constructor(
    private stealthService: StealthService,
  ){}
  
  @Get('/gst/:customerGUID')
  async checkEmailExists2(@Param('customerGUID') customerGUID:string) {
    const script = "script";    
    return await this.stealthService.getScript(customerGUID);
  }
}