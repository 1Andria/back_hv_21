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
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = require("stripe");
const expenses_service_1 = require("../expenses/expenses.service");
let StripeService = class StripeService {
    expenseService;
    transactionModel;
    userModel;
    stripe;
    constructor(expenseService, transactionModel, userModel) {
        this.expenseService = expenseService;
        this.transactionModel = transactionModel;
        this.userModel = userModel;
        this.stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
    }
    async createPayment(userEmail, priceId = `price_1RbqGgH6bl8cWzkGBnBKDlzh`, quantity) {
        const user = await this.userModel.findOne({ email: userEmail });
        if (!user?._id) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!priceId) {
            throw new common_1.BadRequestException(' not priceID found');
        }
        const customerId = user.stripeCustomerId
            ? user.stripeCustomerId
            : await this.createStripeCustomerId(user._id, user.email);
        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONT_URL}?type=success`,
            cancel_url: `${process.env.FRONT_URL}?type=cancel`,
            metadata: {
                userId: user._id.toString(),
            },
        });
        await this.transactionModel.create({
            sessionId: session.id,
            userId: user._id,
            amount: session.amount_total ? session.amount_total / 100 : 0,
        });
        return { url: session.url };
    }
    async createStripeCustomerId(userId, userEmail) {
        const customer = await this.stripe.customers.create({ email: userEmail });
        await this.userModel.findByIdAndUpdate(userId, { stripeCustomerId: customer.id }, { new: true });
        return customer.id;
    }
    async webHook(headers, body) {
        const sig = headers['stripe-signature'];
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(body, sig, process.env.WEBHOOK_API_SECRET);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            const amountTotal = session.amount_total;
            if (!userId || !amountTotal) {
                throw new common_1.BadRequestException('Missing metadata in checkout session');
            }
            const amount = amountTotal / 100;
            await this.expenseService.createExpense({
                category: 'Stripe Payment',
                productName: 'Purchase',
                quantity: 1,
                price: amount,
            }, userId);
            console.log('Expense created successfully from Stripe webhook');
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('transaction')),
    __param(2, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [expenses_service_1.ExpenseService,
        mongoose_2.Model,
        mongoose_2.Model])
], StripeService);
//# sourceMappingURL=stripe.service.js.map