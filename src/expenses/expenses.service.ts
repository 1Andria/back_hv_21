import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel('expense') private readonly expenseModel: Model<Expense>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}

  async getAllExpenses(
    page: number,
    take: number,
    priceFrom?: number,
    priceTo?: number,
    category?: string,
  ) {
    const filter: any = {};

    if (priceFrom !== undefined) {
      filter.price = { ...(filter.price || {}), $gte: priceFrom };
    }

    if (priceTo !== undefined) {
      filter.price = { ...(filter.price || {}), $lte: priceTo };
    }

    if (category) {
      filter.category = { $regex: `^${category}`, $options: 'i' };
    }

    const skip = (page - 1) * take;

    const data = await this.expenseModel
      .find(filter)
      .sort({ _id: -1 })
      .populate({ path: 'userId', select: 'email FirstName' })
      .skip(skip)
      .limit(take);

    const total = await this.expenseModel.countDocuments(filter);

    return {
      data,
      total,
      page,
    };
  }

  async getExpenseById(id) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Expense ID provided', HttpStatus.BAD_REQUEST);
    }
    const expense = await this.expenseModel.findById(id);
    if (!expense) {
      throw new HttpException('expense not found ', HttpStatus.NOT_FOUND);
    }
    return expense;
  }

  async createExpense(
    { category, productName, quantity, price }: CreateExpenseDto,
    user: string,
  ) {
    const existUser = await this.userModel.findById(user);
    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    const totalPrice = quantity * price;
    const newExpense = await this.expenseModel.create({
      category,
      productName,
      quantity,
      price,
      totalPrice: totalPrice,
      userId: existUser._id,
    });

    await this.userModel.findByIdAndUpdate(existUser._id, {
      $push: { expenses: newExpense._id },
    });

    return { success: 'ok', data: newExpense };
  }

  async deleteExpense(id: string, user: string) {
    const expense = await this.expenseModel.findById(id);
    const isAdmin = await this.userModel.findById(user);

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId.toString() !== user && isAdmin?.role !== 'admin') {
      throw new BadRequestException('It is not your expense');
    }

    await this.expenseModel.findByIdAndDelete(id);

    await this.userModel.findByIdAndUpdate(user, {
      $pull: { expenses: new Types.ObjectId(id) },
    });
    return 'Deleted successfully';
  }

  async updateExpense(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
    user: string,
  ) {
    const existingExpense = await this.expenseModel.findById(id);
    if (!existingExpense) {
      throw new NotFoundException('Expense not found');
    }

    if (existingExpense.userId.toString() !== user) {
      throw new BadRequestException('It is not your expense');
    }

    const updateReq: Partial<UpdateExpenseDto & { totalPrice: number }> = {};

    if (updateExpenseDto.category) {
      updateReq.category = updateExpenseDto.category;
    }

    if (updateExpenseDto.productName) {
      updateReq.productName = updateExpenseDto.productName;
    }

    if (
      updateExpenseDto.quantity !== undefined &&
      typeof updateExpenseDto.quantity !== 'number'
    ) {
      throw new BadRequestException('Quantity should be a number');
    }

    if (
      updateExpenseDto.price !== undefined &&
      typeof updateExpenseDto.price !== 'number'
    ) {
      throw new BadRequestException('Price should be a number');
    }

    const updatedQuantity =
      updateExpenseDto.quantity ?? existingExpense.quantity;
    const updatedPrice = updateExpenseDto.price ?? existingExpense.price;
    updateReq.quantity = updatedQuantity;
    updateReq.price = updatedPrice;
    updateReq.totalPrice = updatedQuantity * updatedPrice;

    await this.expenseModel.findByIdAndUpdate(id, updateReq);

    return 'Expense updated successfully';
  }
}
