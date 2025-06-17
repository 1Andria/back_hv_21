import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
@Injectable()
export class ExpenseService {
  private expenses = [
    {
      id: 1,
      category: 'Shopping',
      productName: 'Shoes',
      quantity: 6,
      price: 30,
      totalPrice: 180,
    },
    {
      id: 2,
      category: 'Groceries',
      productName: 'meat',
      quantity: 4,
      price: 40,
      totalPrice: 160,
    },
  ];

  getAllExpenses(
    page: number,
    take: number,
    priceFrom: number,
    priceTo: number,
  ) {
    let filtered = this.expenses;

    if (priceFrom) {
      filtered = filtered.filter((el) => el.price >= priceFrom);
    }

    if (priceTo) {
      filtered = filtered.filter((el) => el.price <= priceTo);
    }

    const start = (page - 1) * take;
    const end = page * take;

    const paginatedItems = filtered.slice(start, end);

    const total = filtered.length;

    return {
      data: paginatedItems,
      total,
      page,
    };
  }

  getExpenseById(id: number) {
    const expense = this.expenses.find((el) => el.id === id);
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  createExpense({ category, productName, quantity, price }: CreateExpenseDto) {
    const lastId = this.expenses[this.expenses.length - 1]?.id || 0;

    const newExpense = {
      id: lastId + 1,
      category,
      productName,
      quantity,
      price,
      totalPrice: price * quantity,
    };

    this.expenses.push(newExpense);

    return 'Expense created successfully';
  }

  deleteExpense(id: number) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.expenses.splice(index, 1);
    return 'Expense deleted successfully';
  }

  updateExpense(id: number, updateExpenseDto: UpdateExpenseDto) {
    const index = this.expenses.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    const existingExpense = this.expenses[index];

    const updateReq: UpdateExpenseDto = {};

    if (updateExpenseDto.category) {
      updateReq.category = updateExpenseDto.category;
    }
    if (updateExpenseDto.productName) {
      updateReq.productName = updateExpenseDto.productName;
    }
    if (
      updateExpenseDto.quantity &&
      typeof updateExpenseDto.quantity !== 'number'
    ) {
      throw new HttpException(
        'Quantity should be a number',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateExpenseDto.price && typeof updateExpenseDto.price !== 'number') {
      throw new BadRequestException('Price should be a number');
    }

    const updatedQuantity =
      updateExpenseDto.quantity ?? existingExpense.quantity;
    const updatedPrice = updateExpenseDto.price ?? existingExpense.price;
    updateReq.quantity = updatedQuantity;
    updateReq.price = updatedPrice;
    updateReq.totalPrice = updatedQuantity * updatedPrice;

    this.expenses[index] = {
      ...this.expenses[index],
      ...updateReq,
    };

    return 'Expense updated successfully';
  }
}
