import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CrmMatchingHistoryDocument = CrmMatchingHistory &  Document;

@Schema()
export class CrmMatchingHistory {

  @Prop({})
  crmMatched: string;

  @Prop({})
  fileName: string;

  @Prop({ default:0 })
  totalRecords: number;

  @Prop({ default: Date.now })
  uploadDate: Date;

  @Prop({})
  filePath: string;

  @Prop({})
  matchedEmails: string;

  @Prop({ default:0 })
  isDeleted: Boolean;
  
  @Prop({})
  uID: string;
}

export const CrmMatchingHistorySchema = SchemaFactory.createForClass(CrmMatchingHistory);
