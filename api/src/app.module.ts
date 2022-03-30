import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AuthorizeNetModule } from './authorize/authorize.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/stealth-app', {
      ...(
        process.env.DB_PASSWORD && process.env.DB_USERNAME 
        ?
          { 
            pass: process.env.DB_PASSWORD,
            user: process.env.DB_USERNAME
          }
        : {}
      )
    }),
    AuthModule,
    ClientModule,
    AuthorizeNetModule,
    AdminModule,
    CommonModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot()
  ],
  controllers: [AppController]
})
export class AppModule {}
