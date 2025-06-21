import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Status } from 'src/common/enums/status.enum';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
  })
  sessionId: string;

  @Prop({
    type: Number,
  })
  amount: number;

  @Prop({
    enum: Status,
    default: Status.PENDING,
  })
  status: string;
}

export const transactionSchema = SchemaFactory.createForClass(Transaction);
