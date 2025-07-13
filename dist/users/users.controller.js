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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const query_params_dto_1 = require("./dto/query-params.dto");
const gender_pipe_1 = require("./pipes/gender.pipe");
const isAuth_guard_1 = require("../common/guards/isAuth.guard");
const user_decorator_1 = require("./decorators/user.decorator");
const changeUserRole_dto_1 = require("./dto/changeUserRole.dto");
const platform_express_1 = require("@nestjs/platform-express");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAllUsers(gender, email, { page, take }) {
        return this.usersService.getAllUsers(page, take, gender, email);
    }
    getUserByGender() {
        return this.usersService.getUserByGender();
    }
    uploadFile(file, userId) {
        return this.usersService.createProfPicture(file, userId);
    }
    getUserById(id) {
        return this.usersService.getUserById(id);
    }
    deleteUserById(id) {
        return this.usersService.deleteUserById(id);
    }
    changeProfPicture(userId, file) {
        return this.usersService.changeProfilePicture(file, userId);
    }
    changeUserRole(userId, changeUserRoleDto) {
        return this.usersService.changeUserRole(userId, changeUserRoleDto);
    }
    updateUserById(id, updateUserDto) {
        return this.usersService.updateUserById(id, updateUserDto);
    }
    upgradeSubscription(id) {
        return this.usersService.upgradeSubscription(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('gender', new gender_pipe_1.GenderPipe())),
    __param(1, (0, common_1.Query)('email')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, query_params_dto_1.QueryUserParamDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('gender'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserByGender", null);
__decorate([
    (0, common_1.Post)('profile-picture'),
    (0, common_1.UseGuards)(isAuth_guard_1.IsAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, user_decorator_1.UserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.Patch)('/change-profile-picture'),
    (0, common_1.UseGuards)(isAuth_guard_1.IsAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, user_decorator_1.UserId)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeProfPicture", null);
__decorate([
    (0, common_1.Patch)('/change-role'),
    (0, common_1.UseGuards)(isAuth_guard_1.IsAuthGuard),
    __param(0, (0, user_decorator_1.UserId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, changeUserRole_dto_1.ChangeUserRoleDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeUserRole", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUserById", null);
__decorate([
    (0, common_1.Put)('/upgrade-subscription/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "upgradeSubscription", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map