import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    default: 'user',
  })
  role: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  FirstName: string;

  @Prop({
    type: String,
    required: true,
  })
  LastName: string;

  @Prop({
    type: Number,
    required: true,
  })
  phoneNumber: number;

  @Prop({
    type: String,
    required: true,
  })
  gender: string;

  @Prop({
    type: String,
  })
  stripeCustomerId: string;

  @Prop({ type: Date })
  subscriptionStartDate: Date;

  @Prop({ type: Date })
  subscriptionEndDate: Date;

  @Prop({
    type: [mongoose.Types.ObjectId],
    default: [],
    ref: 'expense',
  })
  expenses: mongoose.Types.ObjectId[];

  @Prop({
    type: [mongoose.Types.ObjectId],
    default: [],
    ref: 'product',
  })
  products: mongoose.Types.ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(User);
