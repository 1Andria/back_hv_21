import { Body, Controller, Headers, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentDto } from './dto/create-payment.dto';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout')
  createCheckout(@Body() { email, priceId, quantity }: PaymentDto) {
    return this.stripeService.createPayment(email, priceId, quantity);
  }

  @Post('webhook')
  webhook(@Body() rawBody, @Headers() headers) {
    return this.stripeService.webHook(headers, rawBody);
  }
}
