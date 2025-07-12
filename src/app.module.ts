import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { ExpenseModule } from './expenses/expenses.module';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { InfoMiddleware } from './common/middlewares/info.middleware';
import { AnalyticsModule } from './analytics/analytics.module';
import { AsdasdModule } from './asdasd/asdasd.module';

@Module({
  imports: [
    UserModule,
    ExpenseModule,
    StripeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    ProductsModule,
    AuthModule,
    AnalyticsModule,
    AsdasdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InfoMiddleware).forRoutes('*');
  }
}
