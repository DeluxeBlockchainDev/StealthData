import { AdminService } from 'src/admin/services/admin.service';
import { ClientService } from 'src/client/services/client.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private adminService;
    private clientService;
    private jwtService;
    constructor(adminService: AdminService, clientService: ClientService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}
