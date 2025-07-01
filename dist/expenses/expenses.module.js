"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModule = void 0;
const common_1 = require("@nestjs/common");
const expenses_controller_1 = require("./expenses.controller");
const expenses_service_1 = require("./expenses.service");
const expense_schema_1 = require("./schema/expense.schema");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("../users/entities/user.entity");
let ExpenseModule = class ExpenseModule {
};
exports.ExpenseModule = ExpenseModule;
exports.ExpenseModule = ExpenseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { schema: expense_schema_1.expenseSchema, name: 'expense' },
                { schema: user_entity_1.userSchema, name: 'user' },
            ]),
        ],
        controllers: [expenses_controller_1.ExpenseController],
        providers: [expenses_service_1.ExpenseService],
        exports: [expenses_service_1.ExpenseService],
    })
], ExpenseModule);
//# sourceMappingURL=expenses.module.js.map