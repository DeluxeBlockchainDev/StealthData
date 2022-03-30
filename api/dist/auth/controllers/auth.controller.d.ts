import { JwtService } from '@nestjs/jwt';
import { ClientService } from 'src/client/services/client.service';
import { EmailService } from 'src/common/services/email.service';
import { AuthService } from '../services/auth.service';
export declare class AuthController {
    private authService;
    private clientService;
    private jwtService;
    private emailService;
    constructor(authService: AuthService, clientService: ClientService, jwtService: JwtService, emailService: EmailService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): any;
    forgotPassword(email: string): Promise<{
        success: number;
        message: string;
    }>;
    resetPassword(token: string, password: string, confirmPassword: string): Promise<{
        success: number;
        message: string;
    }>;
}
