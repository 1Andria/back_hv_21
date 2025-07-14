"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const uuid_1 = require("uuid");
const aws_service_1 = require("../aws/aws.service");
let UsersService = class UsersService {
    userModel;
    awsService;
    constructor(userModel, awsService) {
        this.userModel = userModel;
        this.awsService = awsService;
    }
    async getAllUsers(page, take, gender, email) {
        console.log(this.userModel);
        const filter = {};
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
    async changeProfilePicture(file, userId) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.profilePicture &&
            user.profilePicture !== 'has not profile picture') {
            await this.awsService.deleteFileById(user.profilePicture);
        }
        const fileType = file.mimetype.split('/')[1];
        const fileId = `${(0, uuid_1.v4)()}.${fileType}`;
        await this.awsService.uploadFile(fileId, file);
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, { profilePicture: fileId }, { new: true });
        return {
            message: 'Profile picture updated',
            user: updatedUser,
            profilePicture: `${process.env.CLOUD_FRONT_URL}/${fileId}`,
        };
    }
    async deleteProfilePicture(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (user.profilePicture === 'has not profile picture')
            throw new common_1.BadRequestException('U dont have profile picture');
        this.awsService.deleteFileById(user.profilePicture);
        await this.userModel.updateOne({ _id: userId }, {
            profilePicture: 'has not profile picture',
        });
        return 'Profile picture deleted successfuly';
    }
    async createProfPicture(file, userId) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const fileType = file.mimetype.split('/')[1];
        const fileId = `${(0, uuid_1.v4)()}.${fileType}`;
        await this.awsService.uploadFile(fileId, file);
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, { profilePicture: fileId }, { new: true });
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
    async getUserById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.HttpException('Invalid ID provided', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userModel
            .findById(id)
            .populate({ path: 'products', select: 'description category' })
            .populate({ path: 'expenses', select: 'productName' });
        if (!user) {
            throw new common_1.HttpException('User not found ', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async deleteUserById(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID provided');
        }
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new common_1.NotFoundException('user not found');
        }
        return deletedUser;
    }
    async updateUserById(id, { FirstName, LastName, email, gender, phoneNumber }) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID provided');
        }
        const updateData = {};
        if (FirstName !== undefined)
            updateData.FirstName = FirstName;
        if (LastName !== undefined)
            updateData.LastName = LastName;
        if (email !== undefined)
            updateData.email = email;
        if (gender !== undefined)
            updateData.gender = gender;
        if (phoneNumber !== undefined)
            updateData.phoneNumber = phoneNumber;
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    findUserByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async upgradeSubscription(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid ID privoded');
        }
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async changeUserRole(userId, { targetUserEmail }) {
        const isUserAdmin = await this.userModel.findById(userId);
        if (isUserAdmin?.role !== 'admin') {
            throw new common_1.BadRequestException('You are not admin so u cant change role');
        }
        const targetUser = await this.userModel.findOne({ email: targetUserEmail });
        if (!targetUser || targetUser.role === 'admin') {
            throw new common_1.BadRequestException('User not found or already is admin');
        }
        if (isUserAdmin.role === 'admin' && targetUser.role !== 'admin') {
            targetUser.role = 'admin';
            await targetUser.save();
        }
        return 'Role changed successfully';
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        aws_service_1.AwsService])
], UsersService);
//# sourceMappingURL=users.service.js.map