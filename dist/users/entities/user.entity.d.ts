import mongoose from 'mongoose';
export declare class User {
    email: string;
    role: string;
    password: string;
    FirstName: string;
    LastName: string;
    phoneNumber: number;
    age: number;
    isActive: boolean;
    gender: string;
    stripeCustomerId: string;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
    expenses: mongoose.Types.ObjectId[];
    products: mongoose.Types.ObjectId[];
}
export declare const userSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User, any> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>, {}> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
