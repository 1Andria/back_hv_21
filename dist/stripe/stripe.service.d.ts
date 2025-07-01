import { Model } from 'mongoose';
import { Transaction } from './entities/stripe.entity';
import { User } from 'src/users/entities/user.entity';
import { ExpenseService } from 'src/expenses/expenses.service';
export declare class StripeService {
    private readonly expenseService;
    private readonly transactionModel;
    private readonly userModel;
    private stripe;
    constructor(expenseService: ExpenseService, transactionModel: Model<Transaction>, userModel: Model<User>);
    createPayment(userEmail: string, priceId: string | undefined, quantity: any): Promise<{
        url: string | null;
    }>;
    createStripeCustomerId(userId: any, userEmail: any): Promise<string>;
    webHook(headers: any, body: any): Promise<void>;
}
