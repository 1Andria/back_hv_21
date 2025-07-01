import { Model } from 'mongoose';
import { Expense } from 'src/expenses/schema/expense.schema';
import { Product } from 'src/products/schema/product.schema';
import { User } from 'src/users/entities/user.entity';
export declare class AnalyticsService {
    private readonly expenseModel;
    private readonly productModel;
    private readonly userModel;
    constructor(expenseModel: Model<Expense>, productModel: Model<Product>, userModel: Model<User>);
    getAllInformation(userId: string): Promise<{
        users: (import("mongoose").Document<unknown, {}, User, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        expenses: (import("mongoose").Document<unknown, {}, Expense, {}> & Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        products: (import("mongoose").Document<unknown, {}, Product, {}> & Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
}
