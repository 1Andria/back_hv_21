import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { getModelToken } from '@nestjs/mongoose';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let userService: UsersService;
  let userModel: Model<User>;

  const mockUserModel = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    populate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const userMock = {
    _id: '12345678901234567890aaaa',
    FirstName: 'giorgi',
    LastName: 'giorgi',
    email: 'giorgi@gmail.com',
    phoneNumber: 557399184,
    gender: 'male',
    subscriptionStartDate: 2023,
    subscriptionEndDate: 2034,
    age: 21,
    __v: 0,
  };

  //   id: number;
  // FirstName: string;
  // LastName: string;
  // email: string;
  // phoneNumber: number;
  // gender: string;
  // subscriptionStartDate: Date;
  // subscriptionEndDate: Date;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('user'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken('user'));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('FindById', () => {
    it('should throw error when wrong ID is provided', async () => {
      const invalidID = 'wrongID';
      expect(async () => {
        await userService.getUserById(invalidID);
      }).rejects.toThrow(HttpException);
    });

    it('should throw notfound error when user is not found', async () => {
      const finalResult = null;

      const secondPopulate = jest.fn().mockResolvedValue(finalResult);
      const firstPopulate = jest
        .fn()
        .mockReturnValue({ populate: secondPopulate });
      jest
        .spyOn(userModel, 'findById')
        .mockReturnValue({ populate: firstPopulate } as any);
      await expect(
        userService.getUserById('12345678901234567890aaaa'),
      ).rejects.toThrow(HttpException);
      expect(firstPopulate).toHaveBeenCalledWith({
        path: 'products',
        select: 'description category',
      });
      expect(secondPopulate).toHaveBeenCalledWith({
        path: 'expenses',
        select: 'productName',
      });
    });

    it('should return user when everything is correct', async () => {
      const secondPopulate = jest.fn().mockResolvedValue(userMock);
      const firstPopulate = jest
        .fn()
        .mockReturnValue({ populate: secondPopulate });
      jest
        .spyOn(userModel, 'findById')
        .mockReturnValue({ populate: firstPopulate } as any);

      const user = await userService.getUserById('12345678901234567890aaaa');
      expect(user).toEqual(userMock);
    });
  });

  describe('deleteUserById', () => {
    it('should throw error when wrong ID is provided', async () => {
      const invalidID = 'wrongID';
      expect(async () => {
        await userService.deleteUserById(invalidID);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw notfound error when user is not found', async () => {
      jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(null);
      expect(async () => {
        await userService.deleteUserById('12345678901234567890aaaa');
      }).rejects.toThrow(NotFoundException);
    });

    it('should return deleted user when everything is correct', async () => {
      jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(userMock);

      const user = await userService.deleteUserById('12345678901234567890aaaa');
      expect(user._id).toBe(userMock._id);
    });
  });

  describe('upgradeSubscriptionDate', () => {
    it('should throw error when invalid id is provided', async () => {
      const invalidID = 'wrongID';
      expect(async () => {
        await userService.upgradeSubscription(invalidID);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw notfound error when user is not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);
      expect(async () => {
        await userService.upgradeSubscription('12345678901234567890aaaa');
      }).rejects.toThrow(NotFoundException);
    });

    it('should return updated user with new subscription date when everything is correct', async () => {
      const currentDate = new Date('2025-07-12');
      const newEndDate = new Date(currentDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      newEndDate.setHours(0, 0, 0, 0);
      const mockUser = {
        ...userMock,
        subscriptionEndDate: currentDate,
      };
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue({
        ...mockUser,
        subscriptionEndDate: newEndDate,
      } as any);

      const result = await userService.upgradeSubscription(mockUser._id);
      expect(result.message).toBe('Subscription upgraded successfully');
      expect(new Date(result.newEndDate).toDateString()).toBe(
        newEndDate.toDateString(),
      );
    });
  });

  describe('updateUserById', () => {
    it('should throw error when invalid id is provided', async () => {
      const invalidID = 'wrongID';
      const updateUserDto = {
        FirstName: 'giorgi',
      };
      expect(async () => {
        await userService.updateUserById(invalidID, updateUserDto);
      }).rejects.toThrow(BadRequestException);
    });

    it('should throw notfound error when user is not found', async () => {
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(null);
      const updateUserDto = {
        FirstName: 'giorgi',
      };
      expect(async () => {
        await userService.updateUserById(
          '12345678901234567890aaaa',
          updateUserDto,
        );
      }).rejects.toThrow(NotFoundException);
    });

    it('should return updated user when everything is correct', async () => {
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(userMock);
      const updateUserDto = {
        FirstName: 'giorgi',
      };
      const user = await userService.updateUserById(
        '12345678901234567890aaaa',
        updateUserDto,
      );
      expect(user._id).toBe(userMock._id);
    });
  });
});
