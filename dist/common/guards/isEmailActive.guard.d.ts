import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
export declare class IsEmailActiveGuard implements CanActivate {
    private readonly usersService;
    constructor(usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
