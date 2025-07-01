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
    getUserById(id: any): Promise<import("mongoose").Document<unknown, {}, import("./entities/user.entity").User, {}> & import("./entities/user.entity").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteUserById(id: any): Promise<string>;
    changeUserRole(userId: any, changeUserRoleDto: ChangeUserRoleDto): Promise<string>;
    updateUserById(id: any, updateUserDto: UpdateUserDto): Promise<string>;
    upgradeSubscription(id: any): Promise<{
        message: string;
        newEndDate: Date;
    }>;
}
