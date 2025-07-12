import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expenses.service';
import { Model } from 'mongoose';
import { Expense } from './schema/expense.schema';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

describe('ExpenseSerivce', () => {
  let expenseService: ExpenseService;
  let expenseModel: Model<Expense>;
  let userModel: Model<User>;

  const mockExpenseModel = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    populate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    populate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const expenseMock = {
    _id: '12345678901234567890aaaa',
    category: 'giorgi',
    productName: 'giorgi',
    quantity: 557399184,
    price: 2023,
    totalPrice: 2034,
    userId: '12345678901234567890aaab',
    __v: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: getModelToken('expense'),
          useValue: mockExpenseModel,
        },
        {
          provide: getModelToken('user'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    expenseService = module.get<ExpenseService>(ExpenseService);
    expenseModel = module.get<Model<Expense>>(getModelToken('expense'));
    userModel = module.get<Model<User>>(getModelToken('user'));
  });

  it('should be defined', () => {
    expect(expenseService).toBeDefined();
  });

  describe('findById', () => {
    it('should throw error when wrong ID is provided', async () => {
      const invalidID = 'wrongID';
      expect(async () => {
        await expenseService.getExpenseById(invalidID);
      }).rejects.toThrow(HttpException);
    });

    it('should throw notfound error when expense not found', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(null);
      expect(async () => {
        await expenseService.getExpenseById('12345678901234567890aaaa');
      }).rejects.toThrow(HttpException);
    });

    it('should return expense when everything is correct', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(expenseMock);

      const exp = await expenseService.getExpenseById(
        '12345678901234567890aaaa',
      );
      expect(exp._id).toBe(expenseMock._id);
    });
  });

  describe('updateExpense', () => {
    const validExpenseId = '12345678901234567890aaaa';
    const userId = '12345678901234567890aaab';
    const senderUserId = '12345678901234567890aaac';

    it('should throw NotFoundException if expense not found', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(null);

      await expect(
        expenseService.updateExpense(validExpenseId, {}, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if expense belongs to another user', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue({
        ...expenseMock,
        userId: senderUserId,
      });

      await expect(
        expenseService.updateExpense(validExpenseId, {}, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if quantity is not a number', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(expenseMock);

      await expect(
        expenseService.updateExpense(
          validExpenseId,
          { quantity: 'asda' } as any,
          userId,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if price is not a number', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(expenseMock);

      await expect(
        expenseService.updateExpense(
          validExpenseId,
          { price: 'dsaas' } as any,
          userId,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update expense successfully', async () => {
      const updatedDto = {
        category: 'new cat',
      };

      jest.spyOn(expenseModel, 'findById').mockResolvedValue(expenseMock);
      const updateSpy = jest
        .spyOn(expenseModel, 'findByIdAndUpdate')
        .mockResolvedValue({} as any);

      const result = await expenseService.updateExpense(
        validExpenseId,
        updatedDto,
        userId,
      );

      expect(result).toBe('Expense updated successfully');
    });
  });

  describe('deleteExpense', () => {
    const validExpenseId = '12345678901234567890aaaa';
    const ownerUserId = '12345678901234567890aaab';
    const otherUserId = '12345678901234567890aaac';

    it('should throw NotFoundException if expense does not exist', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(null);

      await expect(
        expenseService.deleteExpense(validExpenseId, ownerUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if expense does not belong to user or user is not admin', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue({
        ...expenseMock,
        userId: ownerUserId,
      });

      jest.spyOn(userModel, 'findById').mockResolvedValue({
        _id: otherUserId,
        role: 'user',
      });

      await expect(
        expenseService.deleteExpense(validExpenseId, otherUserId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow admin to delete any expense', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(expenseMock);
      jest.spyOn(userModel, 'findById').mockResolvedValue({
        _id: otherUserId,
        role: 'admin',
      });

      jest
        .spyOn(expenseModel, 'findByIdAndDelete')
        .mockResolvedValue({} as any);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue({} as any);

      const result = await expenseService.deleteExpense(
        validExpenseId,
        otherUserId,
      );
      expect(result).toBe('Deleted successfully');
    });

    it('should allow owner to delete their own expense', async () => {
      jest.spyOn(expenseModel, 'findById').mockResolvedValue(expenseMock);
      jest.spyOn(userModel, 'findById').mockResolvedValue({
        _id: ownerUserId,
        role: 'user',
      });

      jest
        .spyOn(expenseModel, 'findByIdAndDelete')
        .mockResolvedValue({} as any);
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue({} as any);

      const result = await expenseService.deleteExpense(
        validExpenseId,
        ownerUserId,
      );
      expect(result).toBe('Deleted successfully');
    });
  });

  describe('createExpense', () => {
    const userId = '12345678901234567890aaab';
    const expenseId = '12345678901234567890aaac';

    const createDto = {
      category: 'asdasd',
      productName: 'asdasd',
      quantity: 233,
      price: 10123,
    };

    const mockUser = {
      _id: userId,
      expenses: [],
    };

    const mockCreatedExpense = {
      _id: expenseId,
      ...createDto,
      totalPrice: createDto.quantity * createDto.price,
      userId,
    };

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      await expect(
        expenseService.createExpense(createDto, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create expense and update user with new expense', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
      jest
        .spyOn(expenseModel, 'create')
        .mockResolvedValue(mockCreatedExpense as any);
      const updateUserSpy = jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValue({} as any);

      const result = await expenseService.createExpense(createDto, userId);

      expect(result).toEqual({ success: 'ok', data: mockCreatedExpense });
      expect(updateUserSpy).toHaveBeenCalledWith(userId, {
        $push: { expenses: expenseId },
      });
    });
  });
});
