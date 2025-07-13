import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(userId: string, createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<{
        success: string;
        data: {
            imagesArr: string[];
            price: number;
            name: string;
            description: string;
            category: string;
            quantity: number;
            owner: import("mongoose").Types.ObjectId;
            _id: import("mongoose").Types.ObjectId;
            __v: number;
        };
    }>;
    findAll(req: any): Promise<((import("./schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
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
        owner: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    })[]>;
    findOne(id: string, req: any): Promise<(import("./schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
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
        owner: import("mongoose").Types.ObjectId;
        _id: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    update(userId: string, id: string, updateProductDto: UpdateProductDto): Promise<{
        message: string;
        product: (import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product, {}> & import("./schema/product.schema").Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    deleteFile(fileId: string): Promise<string>;
    remove(userId: string, id: string): Promise<string>;
}
