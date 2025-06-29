import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dtp';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserParamDto } from './dto/query-params.dto';
import { GenderPipe } from './pipes/gender.pipe';
import { UpgradeSubscriptionDto } from './dto/endDate-user.dto';
import { IsAuthGuard } from 'src/common/guards/isAuth.guard';
import { UserId } from './decorators/user.decorator';
import { ChangeUserRoleDto } from './dto/changeUserRole.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getAllUsers(
    @Query('gender', new GenderPipe()) gender,
    @Query('email') email,

    @Query()
    { page, take }: QueryUserParamDto,
  ) {
    return this.usersService.getAllUsers(page, take, gender, email);
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id) {
    return this.usersService.deleteUserById(id);
  }

  @Patch('/change-role')
  @UseGuards(IsAuthGuard)
  changeUserRole(
    @UserId() userId,
    @Body() changeUserRoleDto: ChangeUserRoleDto,
  ) {
    return this.usersService.changeUserRole(userId, changeUserRoleDto);
  }

  @Put(':id')
  updateUserById(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @Put('/upgrade-subscription/:id')
  upgradeSubscription(@Param('id') id) {
    return this.usersService.upgradeSubscription(id);
  }
}
