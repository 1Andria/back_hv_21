import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/entities/user.entity';
import { AwsService } from 'src/aws/aws.service';
export declare class ProductsService {
    private readonly productModel;
    private readonly userModel;
    private awsService;
    constructor(productModel: Model<Product>, userModel: Model<User>, awsService: AwsService);
    uploadFiles(files: Express.Multer.File[]): Promise<string[]>;
    create({ category, description, name, price, quantity }: CreateProductDto, userId: string, files: Express.Multer.File[]): Promise<{
        success: string;
        data: {
            imagesArr: string[];
            price: number;
            name: string;
            description: string;
            category: string;
            quantity: number;
            owner: Types.ObjectId;
            _id: Types.ObjectId;
            __v: number;
        };
    }>;
    findAll(subscriptionActive: boolean): Promise<((Product & {
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
        imagesArr: string[];
        owner: Types.ObjectId;
        _id: Types.ObjectId;
        __v: number;
    })[]>;
    findOne(id: string, subscriptionActive: boolean): Promise<(Product & {
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
        imagesArr: string[];
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
    deleteFileById(fileId: string): Promise<string>;
    remove(id: string, userId: string): Promise<string>;
}
