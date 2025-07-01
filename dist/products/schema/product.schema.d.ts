import mongoose from 'mongoose';
export declare class Product {
    price: number;
    name: string;
    description: string;
    category: string;
    quantity: number;
    owner: mongoose.Types.ObjectId;
}
export declare const productSchema: mongoose.Schema<Product, mongoose.Model<Product, any, any, any, mongoose.Document<unknown, any, Product, any> & Product & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Product, mongoose.Document<unknown, {}, mongoose.FlatRecord<Product>, {}> & mongoose.FlatRecord<Product> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
