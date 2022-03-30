import { Module } from '@nestjs/common';
import { AuthorizeNetController } from './controllers/authorizenet.controller';

@Module({
	imports: [],
  controllers: [AuthorizeNetController],
  providers: [],
  exports: []
})

export class AuthorizeNetModule {}
