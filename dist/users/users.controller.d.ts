import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserParamDto } from './dto/query-params.dto';
import { ChangeUserRoleDto } from './dto/changeUserRole.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(gender: any, email: any, { page, take }: QueryUserParamDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        total: number;
        page: number;
    }>;
    getUserByGender(): Promise<any[]>;
    getUserById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    uploadFile(file: Express.Multer.File, userId: string): Promise<{
        message: string;
        user: (import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        profilePicture: string;
    }>;
    changeProfPicture(userId: any, file: Express.Multer.File): Promise<{
        message: string;
        user: (import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        profilePicture: string;
    }>;
    changeUserRole(userId: any, changeUserRoleDto: ChangeUserRoleDto): Promise<string>;
    updateUserById(id: any, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    upgradeSubscription(id: any): Promise<{
        message: string;
        newEndDate: Date;
    }>;
    deleteProfilePicture(userId: any): Promise<string>;
    deleteUserById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
