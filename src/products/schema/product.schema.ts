import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true })
  owner: mongoose.Types.ObjectId;
}

export const productSchema = SchemaFactory.createForClass(Product);
