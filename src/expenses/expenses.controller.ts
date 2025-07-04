import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { CategoryPipe } from './pipes/category.pipe';
import { HasUserId } from '../common/guards/has-user-id.guard';
import { IsAuthGuard } from 'src/common/guards/isAuth.guard';

@UseGuards(IsAuthGuard)
@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}
  @Get()
  getAllExpenses(
    @Query('category', new CategoryPipe()) category: string,
    @Query('priceFrom') priceFromQuery: string,
    @Query('priceTo') priceToRawQuery: string,
    @Query() { page, take }: QueryParamsDto,
  ) {
    const priceFrom = priceFromQuery ? Number(priceFromQuery) : undefined;
    const priceTo = priceToRawQuery ? Number(priceToRawQuery) : undefined;

    return this.expenseService.getAllExpenses(
      page,
      take,
      priceFrom,
      priceTo,
      category,
    );
  }

  @Get('statistic')
  getByGroup() {
    return this.expenseService.getExpenseByGroup();
  }

  @Get('top-spenders')
  topSpenders(@Query('limit') limitFromQuery: string) {
    const limit = limitFromQuery ? Number(limitFromQuery) : 30;

    return this.expenseService.topSpenders(limit);
  }

  @Get(':id')
  getExpenseById(@Param('id') id) {
    return this.expenseService.getExpenseById(id);
  }

  @Post()
  @UseGuards(new HasUserId())
  createExpense(
    @Headers('user-id') user: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const category = createExpenseDto?.category;
    const productName = createExpenseDto?.productName;
    const price = createExpenseDto?.price;
    const quantity = createExpenseDto?.quantity;

    return this.expenseService.createExpense(
      {
        category,
        productName,
        price,
        quantity,
      },
      user,
    );
  }

  @Delete(':id')
  @UseGuards(new HasUserId())
  deleteExpenseById(@Headers('user-id') user: string, @Param('id') id) {
    return this.expenseService.deleteExpense(id, user);
  }

  @Put(':id')
  @UseGuards(new HasUserId())
  updateExpenseById(
    @Headers('user-id') user,
    @Param('id', ParseIntPipe) id,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateExpense(id, updateExpenseDto, user);
  }
}
