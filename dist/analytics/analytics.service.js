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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let AnalyticsService = class AnalyticsService {
    expenseModel;
    productModel;
    userModel;
    constructor(expenseModel, productModel, userModel) {
        this.expenseModel = expenseModel;
        this.productModel = productModel;
        this.userModel = userModel;
    }
    async getAllInformation(userId) {
        const isUserAdmin = await this.userModel.findById(userId);
        if (!isUserAdmin || isUserAdmin.role !== 'admin') {
            throw new common_1.BadRequestException('User not found or is not an admin');
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('expense')),
    __param(1, (0, mongoose_1.InjectModel)('product')),
    __param(2, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map