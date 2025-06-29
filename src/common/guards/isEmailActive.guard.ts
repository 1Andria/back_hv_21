import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsEmailActiveGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const email = req.headers.email;

    if (!email) {
      req.subscriptionActive = false;
      return true;
    }

    const user = await this.usersService.findUserByEmail(email);
    const now = new Date();

    if (user && new Date(user.subscriptionEndDate) > now) {
      req.subscriptionActive = true;
    } else {
      req.subscriptionActive = false;
    }

    return true;
  }
}
