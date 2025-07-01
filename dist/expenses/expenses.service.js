"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ExpenseService = class ExpenseService {
    expenseModel;
    userModel;
    constructor(expenseModel, userModel) {
        this.expenseModel = expenseModel;
        this.userModel = userModel;
    }
    async getAllExpenses(page, take, priceFrom, priceTo, category) {
        const filter = {};
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
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.HttpException('Expense ID provided', common_1.HttpStatus.BAD_REQUEST);
        }
        const expense = await this.expenseModel.findById(id);
        if (!expense) {
            throw new common_1.HttpException('expense not found ', common_1.HttpStatus.NOT_FOUND);
        }
        return expense;
    }
    async createExpense({ category, productName, quantity, price }, user) {
        const existUser = await this.userModel.findById(user);
        if (!existUser) {
            throw new common_1.BadRequestException('User not found');
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
    async deleteExpense(id, user) {
        const expense = await this.expenseModel.findById(id);
        const isAdmin = await this.userModel.findById(user);
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        if (expense.userId.toString() !== user && isAdmin?.role !== 'admin') {
            throw new common_1.BadRequestException('It is not your expense');
        }
        await this.expenseModel.findByIdAndDelete(id);
        await this.userModel.findByIdAndUpdate(user, {
            $pull: { expenses: new mongoose_2.Types.ObjectId(id) },
        });
        return 'Deleted successfully';
    }
    async updateExpense(id, updateExpenseDto, user) {
        const existingExpense = await this.expenseModel.findById(id);
        if (!existingExpense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        if (existingExpense.userId.toString() !== user) {
            throw new common_1.BadRequestException('It is not your expense');
        }
        const updateReq = {};
        if (updateExpenseDto.category) {
            updateReq.category = updateExpenseDto.category;
        }
        if (updateExpenseDto.productName) {
            updateReq.productName = updateExpenseDto.productName;
        }
        if (updateExpenseDto.quantity !== undefined &&
            typeof updateExpenseDto.quantity !== 'number') {
            throw new common_1.BadRequestException('Quantity should be a number');
        }
        if (updateExpenseDto.price !== undefined &&
            typeof updateExpenseDto.price !== 'number') {
            throw new common_1.BadRequestException('Price should be a number');
        }
        const updatedQuantity = updateExpenseDto.quantity ?? existingExpense.quantity;
        const updatedPrice = updateExpenseDto.price ?? existingExpense.price;
        updateReq.quantity = updatedQuantity;
        updateReq.price = updatedPrice;
        updateReq.totalPrice = updatedQuantity * updatedPrice;
        await this.expenseModel.findByIdAndUpdate(id, updateReq);
        return 'Expense updated successfully';
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('expense')),
    __param(1, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ExpenseService);
//# sourceMappingURL=expenses.service.js.map