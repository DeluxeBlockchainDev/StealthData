import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/services/admin.service';
import { ClientService } from 'src/client/services/client.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private clientService: ClientService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.clientService.findOneWithPassword({ $or: [{ email }, { username: email } ] });
    if ( user && await bcrypt.compare(pass, user.password) ) {
      const { password, ...result } = user;
      return result;
    }
    if( !user ) {
      const admin = await this.adminService.findOne( email );

      if (admin && admin.password === pass) {
        const { password, ...adminResult } = admin;
        return adminResult;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user._id, isAdmin: !!user.isAdmin, firstName: user.firstName, companyName: user.companyName };
    Logger.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}