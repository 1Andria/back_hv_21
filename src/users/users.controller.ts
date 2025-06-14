import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dtp';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id) {
    return this.usersService.getUserById(Number(id));
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
  deleteUserById(@Param('id') id) {
    return this.usersService.deleteUserById(Number(id));
  }

  @Put(':id')
  updateUserById(@Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(Number(id), updateUserDto);
  }
}
