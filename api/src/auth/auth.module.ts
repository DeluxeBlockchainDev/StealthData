import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { ClientModule } from 'src/client/client.module';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import constants from './constants';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    AdminModule,
    ClientModule,
    PassportModule,
    JwtModule.register({
      secret: constants.secret,
      signOptions: { expiresIn: '1 days' },
    }),
    CommonModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
