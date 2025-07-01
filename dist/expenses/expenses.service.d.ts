import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './schema/expense.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
export declare class ExpenseService {
    private readonly expenseModel;
    private readonly userModel;
    constructor(expenseModel: Model<Expense>, userModel: Model<User>);
    getAllExpenses(page: number, take: number, priceFrom?: number, priceTo?: number, category?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
    }>;
    getExpenseById(id: any): Promise<import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createExpense({ category, productName, quantity, price }: CreateExpenseDto, user: string): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteExpense(id: string, user: string): Promise<string>;
    updateExpense(id: string, updateExpenseDto: UpdateExpenseDto, user: string): Promise<string>;
}
