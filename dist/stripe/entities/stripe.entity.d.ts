import mongoose from 'mongoose';
export declare class Transaction {
    userId: mongoose.Schema.Types.ObjectId;
    sessionId: string;
    amount: number;
    status: string;
}
export declare const transactionSchema: mongoose.Schema<Transaction, mongoose.Model<Transaction, any, any, any, mongoose.Document<unknown, any, Transaction, any> & Transaction & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Transaction, mongoose.Document<unknown, {}, mongoose.FlatRecord<Transaction>, {}> & mongoose.FlatRecord<Transaction> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
