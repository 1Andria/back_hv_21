import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { transactionSchema } from './entities/stripe.entity';
import { userSchema } from 'src/users/entities/user.entity';
import { ExpenseModule } from 'src/expenses/expenses.module';

@Module({
  imports: [
    ExpenseModule,
    MongooseModule.forFeature([
      { schema: transactionSchema, name: 'transaction' },
      {
        schema: userSchema,
        name: 'user',
      },
    ]),
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
