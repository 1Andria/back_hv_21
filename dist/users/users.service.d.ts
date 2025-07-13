import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { ChangeUserRoleDto } from './dto/changeUserRole.dto';
import { AwsService } from 'src/aws/aws.service';
export declare class UsersService {
    private readonly userModel;
    private awsService;
    constructor(userModel: Model<User>, awsService: AwsService);
    getAllUsers(page: number, take: number, gender: string, email: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, User, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
    }>;
    changeProfilePicture(file: Express.Multer.File, userId: string): Promise<{
        message: string;
        user: (import("mongoose").Document<unknown, {}, User, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        profilePicture: string;
    }>;
    createProfPicture(file: Express.Multer.File, userId: string): Promise<{
        message: string;
        user: (import("mongoose").Document<unknown, {}, User, {}> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        profilePicture: string;
    }>;
    getUserByGender(): Promise<any[]>;
    getUserById(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteUserById(id: string): Promise<import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateUserById(id: string, { FirstName, LastName, email, gender, phoneNumber }: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, User, {}> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
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
