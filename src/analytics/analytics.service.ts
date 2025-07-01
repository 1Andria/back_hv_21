import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'src/expenses/schema/expense.schema';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel('expense') private readonly expenseModel: Model<Expense>,
    @InjectModel('product') private readonly productModel: Model<Product>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}
  async getAllInformation(userId: string) {
    const isUserAdmin = await this.userModel.findById(userId);
    if (!isUserAdmin || isUserAdmin.role !== 'admin') {
      throw new BadRequestException('User not found or is not an admin');
    }
    const userCount = await this.userModel.find();
    const expenseCount = await this.expenseModel.find();
    const productCount = await this.productModel.find();
    return {
      users: userCount,
      expenses: expenseCount,
      products: productCount,
    };
  }
}
