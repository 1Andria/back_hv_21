import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const userMock = {
    _id: '12345678901234567890aaaa',
    email: 'test@example.com',
    password: 'hashedPassword',
    FirstName: 'Test',
    LastName: 'User',
    age: 30,
    phoneNumber: 599123456,
    gender: 'male',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('user'),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken('user'));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    const mockSignUpDto = {
      email: 'asd@dsa.com',
      password: 'asdasd',
      FirstName: 'asd',
      LastName: 'asd',
      gender: 'male',
      age: 25,
      phoneNumber: 599123456,
    };

    it('should throw error if user already exists', async () => {
      jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue({ _id: 'existingUserId' });

      await expect(authService.signUp(mockSignUpDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create new user ', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      jest.spyOn(userModel, 'create').mockResolvedValue({
        _id: 'newUserId',
        ...mockSignUpDto,
        password: 'hashedPassword',
      } as any);

      const result = await authService.signUp(mockSignUpDto);

      expect(result.message).toBe('created successfully');
      expect(result.newUser.email).toBe(mockSignUpDto.email);
    });
  });

  describe('signIn', () => {
    const mockSignInDto = {
      email: 'test@example.com',
      password: 'pass123',
    };

    it('should throw error if user does not exist', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(authService.signIn(mockSignInDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if password is incorrect', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: userMock._id,
          password: 'hashedPassword',
        }),
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(mockSignInDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return jwt token if everything is correct', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: userMock._id,
          password: 'hashedPassword',
        }),
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockJwtService.sign as jest.Mock).mockReturnValue('mocked.jwt.token');
      const result = await authService.signIn(mockSignInDto);
      expect(result).toEqual({ token: 'mocked.jwt.token' });
    });
  });
});
