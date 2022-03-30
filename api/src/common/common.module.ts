import { HttpModule, Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { GetResponseService } from './services/get-response.service';
import { PeoplesDataService } from './services/peoplesdata-service';
import { PaymentService } from './services/payment.service';
import { StealthService } from './services/stealth.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [StealthService, GetResponseService,PeoplesDataService, PaymentService, EmailService],
  exports: [StealthService, GetResponseService,PeoplesDataService, PaymentService, EmailService]
})
export class CommonModule {}
