import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserParamDto } from './dto/query-params.dto';
import { GenderPipe } from './pipes/gender.pipe';
import { IsAuthGuard } from 'src/common/guards/isAuth.guard';
import { UserId } from './decorators/user.decorator';
import { ChangeUserRoleDto } from './dto/changeUserRole.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('gender')
  getUserByGender() {
    return this.usersService.getUserByGender();
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(id);
  }

  @Post('profile-picture')
  @UseGuards(IsAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: string,
  ) {
    return this.usersService.createProfPicture(file, userId);
  }

  @Patch('/change-profile-picture')
  @UseGuards(IsAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  changeProfPicture(
    @UserId() userId,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.changeProfilePicture(file, userId);
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

  @Delete('remove-profile-picture')
  @UseGuards(IsAuthGuard)
  deleteProfilePicture(@UserId() userId) {
    return this.usersService.deleteProfilePicture(userId);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id) {
    return this.usersService.deleteUserById(id);
  }
}
