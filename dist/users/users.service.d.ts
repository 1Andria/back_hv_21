import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { ChangeUserRoleDto } from './dto/changeUserRole.dto';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    getAllUsers(page: number, take: number, gender: string, email: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, User, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
    }>;
    getUserByGender(): Promise<any[]>;
    getUserById(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteUserById(id: string): Promise<string>;
    updateUserById(id: string, { FirstName, LastName, email, gender, phoneNumber }: UpdateUserDto): Promise<string>;
    findUserByEmail(email: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, User, "findOne", {}>;
    upgradeSubscription(id: string): Promise<{
        message: string;
        newEndDate: Date;
    }>;
    changeUserRole(userId: string, { targetUserEmail }: ChangeUserRoleDto): Promise<string>;
}
