import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product') private readonly productModel: Model<Product>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}

  async create(
    { category, description, name, price, quantity }: CreateProductDto,
    userId: string,
  ) {
    const existUser = await this.userModel.findById(userId);
    if (!existUser) {
      throw new BadRequestException('User not found');
    }
    const newProduct = await this.productModel.create({
      category,
      description,
      name,
      price,
      quantity,
      owner: existUser._id,
    });

    await this.userModel.findByIdAndUpdate(existUser._id, {
      $push: { products: newProduct._id },
    });
    return { success: 'ok', data: newProduct };
  }

  async findAll(subscriptionActive: boolean) {
    console.log(subscriptionActive);

    const products = await this.productModel
      .find()
      .populate({ path: 'owner', select: 'FirstName email' });

    if (subscriptionActive) {
      return products.map((product) => ({
        ...product.toObject(),
        price: product.price / 2,
        discount: 'congrats u have discount',
      }));
    }

    return products;
  }

  async findOne(id: string, subscriptionActive: boolean) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id is invalid');
    }

    const product = await this.productModel
      .findById(id)
      .populate({ path: 'owner', select: 'FirstName email' });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (subscriptionActive) {
      return {
        ...product.toObject(),
        price: product.price / 2,
        discount: 'congrats u have discount',
      };
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const existProduct = await this.productModel.findById(id);
    if (!existProduct) {
      throw new NotFoundException('Product not found');
    }
    if (existProduct.owner.toString() !== userId) {
      throw new BadRequestException('It is not your product');
    }

    const updateReq: Partial<UpdateProductDto> = {};
    if (updateProductDto.category) {
      updateReq.category = updateProductDto.category;
    }
    if (updateProductDto.description) {
      updateReq.description = updateProductDto.description;
    }
    if (updateProductDto.name) {
      updateReq.name = updateProductDto.name;
    }
    if (updateProductDto.price !== undefined) {
      updateReq.price = updateProductDto.price;
    }

    if (updateProductDto.quantity !== undefined) {
      updateReq.quantity = updateProductDto.quantity;
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateReq,
      { new: true },
    );
    return {
      message: 'ok',
      product: updatedProduct,
    };
  }

  async remove(id: string, userId: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.owner.toString() !== userId) {
      throw new BadRequestException('It is not your product');
    }

    await this.productModel.findByIdAndDelete(id);

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { products: new Types.ObjectId(id) },
    });
    return `Product deleted successfully `;
  }
}
