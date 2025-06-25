import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { UserModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from './schema/product.schema';
import { userSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: productSchema, name: 'product' },
      { schema: userSchema, name: 'user' },
    ]),
    UserModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
