import { Controller, Get, Request, Post, UseGuards, Query, BadRequestException, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from 'src/client/services/client.service';
import { EmailService } from 'src/common/services/email.service';
import { JwtAuthGuard } from '../jwt.auth-guard';
import { LocalAuthGuard } from '../local.auth-guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email:string) {
    if( !email ) {
      throw new BadRequestException('Email is required.');
    }

    const client = await this.clientService.findOne({ email });

    if(!client) {
      throw new BadRequestException('Client not found.');
    }

    const token = this.jwtService.sign({ _id: client._id }, { expiresIn: '30m' } );
    const resetLink = process.env.APP_URL + 'auth/reset-password?token=' + token;
    this.emailService.mail({
      to: email,
      from: process.env.SMTP_USERNAME,
      subject: "Forgot Password",
      html: `
        Hello,<br /><br />
        Click on the below link to recover your password <br /> <br />
        <a href="${resetLink}">${resetLink}</a>
        <br /><br />
        Stealth Data.
      `
    })
    return { success:1, message: 'Password Reset Email Sent.' };
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token:string, @Body('password') password:string, @Body('confirmPassword') confirmPassword:string) {
    
    if( !token ) {
      throw new BadRequestException('Token is required.');
    }
    
    if( !password ) {
      throw new BadRequestException('Password is required.');
    }

    if( !confirmPassword ) {
      throw new BadRequestException('Confirm Password is required.');
    }

    if( confirmPassword !== password) {
      throw new BadRequestException('Confirm Password and Password should be the same.');
    }

    try{
      this.jwtService.verify( token );
    } catch(e) {
      throw new UnauthorizedException('Invalid Token.');
    }

    const decoded:any = this.jwtService.decode( token );

    await this.clientService.findOneAndUpdate({ _id: decoded._id }, { password });

    return { success:1, message: 'Password Reset successfully.' };
  }
}