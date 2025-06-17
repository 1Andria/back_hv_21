import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dtp';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      FirstName: 'user1',
      LastName: 'user1shvili',
      email: 'user1.com',
      phoneNumber: 557,
      gender: 'male',
    },
    {
      id: 2,
      FirstName: 'user2',
      LastName: 'user2shvili',
      email: 'user2.com',
      phoneNumber: 558,
      gender: 'female',
    },
    {
      id: 3,
      FirstName: 'user3',
      LastName: 'user3shvili',
      email: 'user3.com',
      phoneNumber: 559,
      gender: 'male',
    },
  ];

  getAllUsers(page: number, take: number, gender: string, email: string) {
    let filteredUsers = this.users;
    if (gender) {
      filteredUsers = filteredUsers.filter((user) =>
        user.gender.startsWith(gender),
      );
    }
    if (email) {
      filteredUsers = filteredUsers.filter((user) =>
        user.email.startsWith(email),
      );
    }

    const start = (page - 1) * take;
    const end = page * take;
    const paginated = filteredUsers.slice(start, end);
    const total = filteredUsers.length;

    return {
      data: paginated,
      total,
      page,
    };
  }

  getUserById(id: number) {
    const user = this.users.find((el) => el.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  createUser({
    email,
    FirstName,
    LastName,
    phoneNumber,
    gender,
  }: CreateUserDto) {
    const lastId = this.users[this.users.length - 1]?.id || 0;

    const newUser = {
      id: lastId + 1,
      FirstName,
      LastName,
      phoneNumber,
      gender,
      email,
    };
    this.users.push(newUser);
    return 'created successfully';
  }

  deleteUserById(id: number) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    this.users.splice(index, 1);
    return 'Deleted successfully';
  }

  updateUserById(id: number, updateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) throw new NotFoundException('User not found');

    const updateReq: UpdateUserDto = {};

    if (updateUserDto.email) {
      updateReq.email = updateUserDto.email;
    }
    if (updateUserDto.FirstName) {
      updateReq.FirstName = updateUserDto.FirstName;
    }
    if (updateUserDto.LastName) {
      updateReq.LastName = updateUserDto.LastName;
    }
    if (
      updateUserDto.phoneNumber &&
      typeof updateUserDto.phoneNumber !== 'number'
    ) {
      throw new HttpException('Invalid properties', HttpStatus.BAD_REQUEST);
    }
    if (updateUserDto.phoneNumber) {
      updateReq.phoneNumber = updateUserDto.phoneNumber;
    }
    if (updateUserDto.gender) {
      updateReq.gender = updateUserDto.gender;
    }

    this.users[index] = {
      ...this.users[index],
      ...updateReq,
    };
    return 'Updated successfully';
  }
}
