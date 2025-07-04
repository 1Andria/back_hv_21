import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryParamsDto } from './dto/query-params.dto';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    getAllExpenses(category: string, priceFromQuery: string, priceToRawQuery: string, { page, take }: QueryParamsDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schema/expense.schema").Expense, {}> & import("./schema/expense.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
    }>;
    getByGroup(): Promise<any[]>;
    topSpenders(limitFromQuery: string): Promise<any[]>;
    getExpenseById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./schema/expense.schema").Expense, {}> & import("./schema/expense.schema").Expense & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createExpense(user: string, createExpenseDto: CreateExpenseDto): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/expense.schema").Expense, {}> & import("./schema/expense.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    deleteExpenseById(user: string, id: any): Promise<string>;
    updateExpenseById(user: any, id: any, updateExpenseDto: UpdateExpenseDto): Promise<string>;
}
