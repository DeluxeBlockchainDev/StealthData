import { Controller, Get, Param, Res} from '@nestjs/common';

@Controller()
export class AppController {
  
  constructor(){}
 
  @Get('uploads/:subDir/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Param('subDir') subDir, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: `uploads/${subDir}`});
  }
}