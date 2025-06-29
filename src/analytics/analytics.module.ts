import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/entities/user.entity';
import { expenseSchema } from 'src/expenses/schema/expense.schema';
import { productSchema } from 'src/products/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: productSchema, name: 'product' },
      { schema: expenseSchema, name: 'expense' },
      { schema: userSchema, name: 'user' },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
