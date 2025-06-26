import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './entities/stripe.entity';
import Stripe from 'stripe';
import { User } from 'src/users/entities/user.entity';
import { ExpenseService } from 'src/expenses/expenses.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    private readonly expenseService: ExpenseService,
    @InjectModel('transaction')
    private readonly transactionModel: Model<Transaction>,
    @InjectModel('user')
    private readonly userModel: Model<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY as string);
  }
  async createPayment(
    userEmail: string,
    priceId = `price_1RbqGgH6bl8cWzkGBnBKDlzh`,
    quantity,
  ) {
    const user = await this.userModel.findOne({ email: userEmail });
    if (!user?._id) {
      throw new BadRequestException('User not found');
    }
    if (!priceId) {
      throw new BadRequestException(' not priceID found');
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
    await this.userModel.findByIdAndUpdate(
      userId,
      { stripeCustomerId: customer.id },
      { new: true },
    );
    return customer.id;
  }

  async webHook(headers, body) {
    const sig = headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.WEBHOOK_API_SECRET as string,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const amountTotal = session.amount_total;

      if (!userId || !amountTotal) {
        throw new BadRequestException('Missing metadata in checkout session');
      }

      const amount = amountTotal / 100;

      await this.expenseService.createExpense(
        {
          category: 'Stripe Payment',
          productName: 'Purchase',
          quantity: 1,
          price: amount,
        },
        userId,
      );

      console.log('Expense created successfully from Stripe webhook');
    }
  }
}
