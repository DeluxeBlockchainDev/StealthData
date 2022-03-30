import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StealthService } from 'src/common/services/stealth.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth-guard';
import { SubscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from '../dto/subscription.dto';


@Controller('subscription')
export class SubscriptionController {
  
  constructor(private subscriptionService: SubscriptionService, private stealthService: StealthService){}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createDto: CreateSubscriptionDto) {
    const subscription = this.subscriptionService.create(createDto);
    return subscription;
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') _id:string, @Body() updateDto: UpdateSubscriptionDto) {
    const updatedSubscription = this.subscriptionService.findOneAndUpdate({ _id}, updateDto);
    return updatedSubscription;
  }

  @Get('/:id')
  read(@Param('id') _id:string) {
    const subscription = this.subscriptionService.findOne({ _id});
    return subscription;
  }

  @Get()
  findAll() {
    const subscriptions = this.subscriptionService.findAll();
    return subscriptions;
  }
}