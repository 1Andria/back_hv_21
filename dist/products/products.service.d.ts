import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/entities/user.entity';
export declare class ProductsService {
    private readonly productModel;
    private readonly userModel;
    constructor(productModel: Model<Product>, userModel: Model<User>);
    create({ category, description, name, price, quantity }: CreateProductDto, userId: string): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, Product, {}> & Product & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    findAll(subscriptionActive: boolean): Promise<(import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[] | {
        price: number;
        discount: string;
        name: string;
        description: string;
        category: string;
        quantity: number;
        owner: Types.ObjectId;
        _id: Types.ObjectId;
        __v: number;
    }[]>;
    findOne(id: string, subscriptionActive: boolean): Promise<(import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | {
        price: number;
        discount: string;
        name: string;
        description: string;
        category: string;
        quantity: number;
        owner: Types.ObjectId;
        _id: Types.ObjectId;
        __v: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<{
        message: string;
        product: (import("mongoose").Document<unknown, {}, Product, {}> & Product & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    remove(id: string, userId: string): Promise<string>;
}
