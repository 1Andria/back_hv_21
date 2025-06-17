import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dtp';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserParamDto } from './dto/query-params.dto';
import { GenderPipe } from './pipes/gender.pipe';

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
    console.log(gender);

    return this.usersService.getAllUsers(page, take, gender, email);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id) {
    return this.usersService.getUserById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const email = createUserDto?.email;
    const FirstName = createUserDto?.FirstName;
    const LastName = createUserDto?.LastName;
    const gender = createUserDto?.gender;
    const phoneNumber = createUserDto?.phoneNumber;

    return this.usersService.createUser({
      email,
      FirstName,
      LastName,
      gender,
      phoneNumber,
    });
  }

  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id) {
    return this.usersService.deleteUserById(id);
  }

  @Put(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
}
