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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const aws_service_1 = require("../aws/aws.service");
const uuid_1 = require("uuid");
let ProductsService = class ProductsService {
    productModel;
    userModel;
    awsService;
    constructor(productModel, userModel, awsService) {
        this.productModel = productModel;
        this.userModel = userModel;
        this.awsService = awsService;
    }
    async uploadFiles(files) {
        const uploadFileIds = [];
        for (let file of files) {
            const fileType = file.mimetype.split('/')[1];
            const fileId = `${(0, uuid_1.v4)()}.${fileType}`;
            await this.awsService.uploadFile(fileId, file);
            uploadFileIds.push(fileId);
        }
        return uploadFileIds;
    }
    async create({ category, description, name, price, quantity }, userId, files) {
        const existUser = await this.userModel.findById(userId);
        if (!existUser) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Image is required');
        }
        const imageFileIds = await this.uploadFiles(files);
        const newProduct = await this.productModel.create({
            category,
            description,
            name,
            price,
            quantity,
            owner: existUser._id,
            imagesArr: imageFileIds,
        });
        await this.userModel.findByIdAndUpdate(existUser._id, {
            $push: { products: newProduct._id },
        });
        return {
            success: 'ok',
            data: {
                ...newProduct.toObject(),
                imagesArr: imageFileIds.map((fileId) => `${process.env.CLOUD_FRONT_URL}/${fileId}`),
            },
        };
    }
    async findAll(subscriptionActive) {
        const products = await this.productModel
            .find()
            .populate({ path: 'owner', select: 'FirstName email' });
        return products.map((product) => {
            const productObj = product.toObject();
            if (productObj.imagesArr && productObj.imagesArr.length > 0) {
                productObj.imagesArr = productObj.imagesArr.map((fileId) => `${process.env.CLOUD_FRONT_URL}/${fileId}`);
            }
            if (subscriptionActive) {
                return {
                    ...productObj,
                    price: productObj.price / 2,
                    discount: 'congrats u have discount',
                };
            }
            return productObj;
        });
    }
    async findOne(id, subscriptionActive) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Id is invalid');
        }
        const product = await this.productModel
            .findById(id)
            .populate({ path: 'owner', select: 'FirstName email' });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const productObj = product.toObject();
        if (productObj.imagesArr && productObj.imagesArr.length > 0) {
            productObj.imagesArr = productObj.imagesArr.map((fileId) => `${process.env.CLOUD_FRONT_URL}/${fileId}`);
        }
        if (subscriptionActive) {
            return {
                ...productObj,
                price: productObj.price / 2,
                discount: 'congrats u have discount',
            };
        }
        return productObj;
    }
    async update(id, updateProductDto, userId) {
        const existProduct = await this.productModel.findById(id);
        if (!existProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (existProduct.owner.toString() !== userId) {
            throw new common_1.BadRequestException('It is not your product');
        }
        const updateReq = {};
        if (updateProductDto.category) {
            updateReq.category = updateProductDto.category;
        }
        if (updateProductDto.description) {
            updateReq.description = updateProductDto.description;
        }
        if (updateProductDto.name) {
            updateReq.name = updateProductDto.name;
        }
        if (updateProductDto.price !== undefined) {
            updateReq.price = updateProductDto.price;
        }
        if (updateProductDto.quantity !== undefined) {
            updateReq.quantity = updateProductDto.quantity;
        }
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateReq, { new: true });
        return {
            message: 'ok',
            product: updatedProduct,
        };
    }
    deleteFileById(fileId) {
        if (!fileId)
            throw new common_1.BadRequestException('FileId is required');
        return this.awsService.deleteFileById(fileId);
    }
    async remove(id, userId) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.owner.toString() !== userId) {
            throw new common_1.BadRequestException('It is not your product');
        }
        await this.productModel.findByIdAndDelete(id);
        if (product.imagesArr && product.imagesArr.length > 0) {
            await Promise.all(product.imagesArr.map((fileId) => this.awsService.deleteFileById(fileId)));
        }
        await this.userModel.findByIdAndUpdate(userId, {
            $pull: { products: new mongoose_2.Types.ObjectId(id) },
        });
        return `Product deleted successfully `;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('product')),
    __param(1, (0, mongoose_1.InjectModel)('user')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        aws_service_1.AwsService])
], ProductsService);
//# sourceMappingURL=products.service.js.map