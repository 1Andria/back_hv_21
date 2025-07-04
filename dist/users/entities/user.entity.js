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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let User = class User {
    email;
    role;
    password;
    FirstName;
    LastName;
    phoneNumber;
    age;
    isActive;
    gender;
    stripeCustomerId;
    subscriptionStartDate;
    subscriptionEndDate;
    expenses;
    products;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], User.prototype, "FirstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], User.prototype, "LastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        default: 10,
    }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], User.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "subscriptionStartDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "subscriptionEndDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Types.ObjectId],
        default: [],
        ref: 'expense',
    }),
    __metadata("design:type", Array)
], User.prototype, "expenses", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Types.ObjectId],
        default: [],
        ref: 'product',
    }),
    __metadata("design:type", Array)
], User.prototype, "products", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.userSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.entity.js.map