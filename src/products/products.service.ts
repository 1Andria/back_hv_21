import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private products = [
    {
      id: 1,
      price: 230,
      name: 'product 1',
      description: 'product 1 description',
      category: 'product 1 category',
      quantity: 20,
    },
  ];
  create(createProductDto: CreateProductDto) {
    const lastId = this.products[this.products.length - 1]?.id || 0;

    const newProduct = {
      id: lastId + 1,
      price: createProductDto.price,
      name: createProductDto.name,
      description: createProductDto.description,
      category: createProductDto.category,
      quantity: createProductDto.quantity,
    };

    this.products.push(newProduct);

    return 'Created successfully';
  }

  findAll(subscriptionActive: boolean) {
    if (subscriptionActive) {
      return this.products.map((product) => ({
        ...product,
        price: product.price / 2,
        discount: 'congrats u have discount',
      }));
    }
    return this.products;
  }

  findOne(id: number) {
    const product = this.products.find((el) => el.id === id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    const updateReq: UpdateProductDto = {};

    if (updateProductDto.price) {
      updateReq.price = updateProductDto.price;
    }

    if (updateProductDto.name) {
      updateReq.name = updateProductDto.name;
    }

    if (updateProductDto.category) {
      updateReq.category = updateProductDto.category;
    }

    if (updateProductDto.description) {
      updateReq.description = updateProductDto.description;
    }

    if (updateProductDto.quantity) {
      updateReq.quantity = updateProductDto.quantity;
    }

    console.log(updateReq);

    this.products[index] = {
      ...this.products[index],
      ...updateReq,
    };

    return `Updated successfully`;
  }

  remove(id: number) {
    const index = this.products.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('Product not found');
    }
    this.products.splice(index, 1);
    return `Product deleted successfully `;
  }
}
