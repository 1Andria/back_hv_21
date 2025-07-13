import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './entities/user.entity';
import { ChangeUserRoleDto } from './dto/changeUserRole.dto';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<User>,
    private awsService: AwsService,
  ) {}

  // async onModuleInit() {
  //   const oneWeekAgo = new Date();
  //   oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  //   await this.userModel.updateMany(
  //     { createdAt: { $gte: oneWeekAgo } },
  //     { $set: { isActive: true } },
  //   );

  //   await this.userModel.updateMany(
  //     { createdAt: { $lt: oneWeekAgo } },
  //     { $set: { isActive: false } },
  //   );
  // }

  // async onModuleInit() {
  //   const users = await this.userModel.find();

  //   for (let i = 0; i < users.length; i++) {
  //     const randomAge = faker.number.int({ min: 0, max: 100 });

  //     await this.userModel.updateOne(
  //       { _id: users[i]._id },
  //       { $set: { age: randomAge } },
  //     );
  //   }
  // }

  async getAllUsers(page: number, take: number, gender: string, email: string) {
    console.log(this.userModel);

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

  async changeProfilePicture(file: Express.Multer.File, userId: string) {
    if (!file) throw new BadRequestException('No file uploaded');
    //აქ მერე დავუწერ რო თუ fileის გარეშე დაარექუესტებს default ფოტო დაუყენდება
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (
      user.profilePicture &&
      user.profilePicture !== 'has not profile picture yet'
    ) {
      await this.awsService.deleteFileById(user.profilePicture);
    }

    const fileType = file.mimetype.split('/')[1];
    const fileId = `${uuidv4()}.${fileType}`;
    await this.awsService.uploadFile(fileId, file);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { profilePicture: fileId },
      { new: true },
    );

    return {
      message: 'Profile picture updated',
      user: updatedUser,
      profilePicture: `${process.env.CLOUD_FRONT_URL}/${fileId}`,
    };
  }

  async createProfPicture(file: Express.Multer.File, userId: string) {
    if (!file) throw new BadRequestException('No file uploaded');

    const fileType = file.mimetype.split('/')[1];
    const fileId = `${uuidv4()}.${fileType}`;

    await this.awsService.uploadFile(fileId, file);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { profilePicture: fileId },
      { new: true },
    );

    return {
      message: 'Profile picture updated',
      user: updatedUser,
      profilePicture: `${process.env.CLOUD_FRONT_URL}/${fileId}`,
    };
  }

  async getUserByGender() {
    const users = await this.userModel.aggregate([
      { $group: { _id: '$gender', averageAge: { $avg: '$age' } } },
    ]);
    return users;
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

  async deleteUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID provided');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('user not found');
    }

    return deletedUser;
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

    return updatedUser;
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

    const updatedUserWithSubDate = await this.userModel.findByIdAndUpdate(id, {
      subscriptionEndDate: newEndDate,
    });

    return {
      message: 'Subscription upgraded successfully',
      newEndDate,
    };
  }

  async changeUserRole(userId: string, { targetUserEmail }: ChangeUserRoleDto) {
    const isUserAdmin = await this.userModel.findById(userId);
    if (isUserAdmin?.role !== 'admin') {
      throw new BadRequestException('You are not admin so u cant change role');
    }
    const targetUser = await this.userModel.findOne({ email: targetUserEmail });
    if (!targetUser || targetUser.role === 'admin') {
      throw new BadRequestException('User not found or already is admin');
    }
    if (isUserAdmin.role === 'admin' && targetUser.role !== 'admin') {
      targetUser.role = 'admin';
      await targetUser.save();
    }
    return 'Role changed successfully';
  }
}
