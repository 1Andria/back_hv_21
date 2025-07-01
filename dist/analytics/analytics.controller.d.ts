import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getAllInformation(userId: any): Promise<{
        users: (import("mongoose").Document<unknown, {}, import("../users/entities/user.entity").User, {}> & import("../users/entities/user.entity").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        expenses: (import("mongoose").Document<unknown, {}, import("../expenses/schema/expense.schema").Expense, {}> & import("../expenses/schema/expense.schema").Expense & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        products: (import("mongoose").Document<unknown, {}, import("../products/schema/product.schema").Product, {}> & import("../products/schema/product.schema").Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
}
