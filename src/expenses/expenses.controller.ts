import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}
  @Get()
  getAllExpenses() {
    return this.expenseService.getAllExpenses();
  }

  @Get(':id')
  getExpenseById(@Param('id') id) {
    return this.expenseService.getExpenseById(Number(id));
  }

  @Post()
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    const category = createExpenseDto?.category;
    const productName = createExpenseDto?.productName;
    const price = createExpenseDto?.price;
    const quantity = createExpenseDto?.quantity;

    return this.expenseService.createExpense({
      category,
      productName,
      price,
      quantity,
    });
  }

  @Delete(':id')
  deleteExpenseById(@Param('id') id) {
    return this.expenseService.deleteExpense(Number(id));
  }

  @Put(':id')
  updateExpenseById(
    @Param('id') id,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpense(Number(id), updateExpenseDto);
  }
}
