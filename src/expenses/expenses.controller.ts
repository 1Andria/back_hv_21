import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { CategoryPipe } from './pipes/category.pipe';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}
  @Get()
  getAllExpenses(
    @Query('category', new CategoryPipe()) category: string,
    @Query('priceFrom') priceFrom,
    @Query('priceTo') priceTo,
    @Query() { page, take }: QueryParamsDto,
  ) {
    return this.expenseService.getAllExpenses(page, take, priceFrom, priceTo);
  }

  @Get(':id')
  getExpenseById(@Param('id', ParseIntPipe) id) {
    return this.expenseService.getExpenseById(id);
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
  deleteExpenseById(@Param('id', ParseIntPipe) id) {
    return this.expenseService.deleteExpense(id);
  }

  @Put(':id')
  updateExpenseById(
    @Param('id', ParseIntPipe) id,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpense(id, updateExpenseDto);
  }
}
