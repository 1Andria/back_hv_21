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
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const expenses_service_1 = require("./expenses.service");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_expense_dto_1 = require("./dto/update-expense.dto");
const query_params_dto_1 = require("./dto/query-params.dto");
const category_pipe_1 = require("./pipes/category.pipe");
const has_user_id_guard_1 = require("../common/guards/has-user-id.guard");
const isAuth_guard_1 = require("../common/guards/isAuth.guard");
let ExpenseController = class ExpenseController {
    expenseService;
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    getAllExpenses(category, priceFromQuery, priceToRawQuery, { page, take }) {
        const priceFrom = priceFromQuery ? Number(priceFromQuery) : undefined;
        const priceTo = priceToRawQuery ? Number(priceToRawQuery) : undefined;
        return this.expenseService.getAllExpenses(page, take, priceFrom, priceTo, category);
    }
    getExpenseById(id) {
        return this.expenseService.getExpenseById(id);
    }
    createExpense(user, createExpenseDto) {
        const category = createExpenseDto?.category;
        const productName = createExpenseDto?.productName;
        const price = createExpenseDto?.price;
        const quantity = createExpenseDto?.quantity;
        return this.expenseService.createExpense({
            category,
            productName,
            price,
            quantity,
        }, user);
    }
    deleteExpenseById(user, id) {
        return this.expenseService.deleteExpense(id, user);
    }
    updateExpenseById(user, id, updateExpenseDto) {
        return this.expenseService.updateExpense(id, updateExpenseDto, user);
    }
};
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category', new category_pipe_1.CategoryPipe())),
    __param(1, (0, common_1.Query)('priceFrom')),
    __param(2, (0, common_1.Query)('priceTo')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, query_params_dto_1.QueryParamsDto]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "getAllExpenses", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "getExpenseById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(new has_user_id_guard_1.HasUserId()),
    __param(0, (0, common_1.Headers)('user-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(new has_user_id_guard_1.HasUserId()),
    __param(0, (0, common_1.Headers)('user-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "deleteExpenseById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(new has_user_id_guard_1.HasUserId()),
    __param(0, (0, common_1.Headers)('user-id')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_expense_dto_1.UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "updateExpenseById", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, common_1.UseGuards)(isAuth_guard_1.IsAuthGuard),
    (0, common_1.Controller)('expenses'),
    __metadata("design:paramtypes", [expenses_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expenses.controller.js.map