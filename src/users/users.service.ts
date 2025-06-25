import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dtp';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userModel: Model<User>) {}

  async getAllUsers(page: number, take: number, gender: string, email: string) {
    const filter: any = {};

    if (gender) {
      filter.gender = { $regex: `^${gender}`, $options: 'i' };
    }

    if (email) {
      filter.email = { $regex: `^${email}`, $options: 'i' };
    }

    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .populate({ path: 'products', select: 'description category' })
        .populate({ path: 'expenses', select: 'productName' })
        .skip(skip)
        .limit(take),
      this.userModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
    };
  }

  async getUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID provided', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userModel
      .findById(id)
      .populate({ path: 'products', select: 'description category' })
      .populate({ path: 'expenses', select: 'productName' });

    if (!user) {
      throw new HttpException('User not found ', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createUser({
    email,
    FirstName,
    LastName,
    phoneNumber,
    gender,
  }: CreateUserDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('Email already in use');
    }
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    );
    const newUser = await this.userModel.create({
      email,
      FirstName,
      LastName,
      phoneNumber,
      gender,
      subscriptionStartDate,
      subscriptionEndDate,
    });
    return 'created successfully';
  }

  async deleteUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID provided');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('user not found');
    }

    return 'Deleted successfully';
  }

  async updateUserById(
    id: string,
    { FirstName, LastName, email, gender, phoneNumber }: UpdateUserDto,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID provided');
    }

    const updateData: Partial<IUser> = {};
    if (FirstName !== undefined) updateData.FirstName = FirstName;
    if (LastName !== undefined) updateData.LastName = LastName;
    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return 'Updated successfully';
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async upgradeSubscription(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID privoded');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const now = new Date();
    const currentEndDate = new Date(user.subscriptionEndDate);
    const upgradeStart = currentEndDate > now ? currentEndDate : now;

    const newEndDate = new Date(upgradeStart);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    await this.userModel.findByIdAndUpdate(id, {
      subscriptionEndDate: newEndDate,
    });

    return {
      message: 'Subscription upgraded successfully',
      newEndDate,
    };
  }
}
