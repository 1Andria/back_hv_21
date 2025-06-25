import { Module } from '@nestjs/common';
import { ExpenseController } from './expenses.controller';
import { ExpenseService } from './expenses.service';
import { expenseSchema } from './schema/expense.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: expenseSchema, name: 'expense' },
      { schema: userSchema, name: 'user' },
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
