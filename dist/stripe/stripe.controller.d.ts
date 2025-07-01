import { StripeService } from './stripe.service';
import { PaymentDto } from './dto/create-payment.dto';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createCheckout({ email, priceId, quantity }: PaymentDto): Promise<{
        url: string | null;
    }>;
    webhook(rawBody: any, headers: any): Promise<void>;
}
