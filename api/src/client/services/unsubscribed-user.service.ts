import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UnsubscribedUser, UnsubscribedUserDocument } from '../schemas/unsubscribed-user.schema';

@Injectable()
export class UnsubscribedUserService {
  constructor(@InjectModel(UnsubscribedUser.name) private model: Model<UnsubscribedUserDocument>) {}

  async bulkWrite(paramsArr: any[]): Promise<any> {
    return this.model.bulkWrite(paramsArr);
  }

  async aggregate(pipeline: any): Promise<any> {
    return this.model.aggregate(pipeline);
  }

  async findAll(params?:any): Promise<UnsubscribedUserDocument[]> {
    return this.model.find({ ...params }).exec();
  }
}
