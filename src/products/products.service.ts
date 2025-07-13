import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { User } from 'src/users/entities/user.entity';
import { AwsService } from 'src/aws/aws.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product') private readonly productModel: Model<Product>,
    @InjectModel('user') private readonly userModel: Model<User>,
    private awsService: AwsService,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadFileIds: string[] = [];

    for (let file of files) {
      const fileType = file.mimetype.split('/')[1];
      const fileId = `${uuidv4()}.${fileType}`;
      await this.awsService.uploadFile(fileId, file);
      uploadFileIds.push(fileId);
    }

    return uploadFileIds;
  }

  async create(
    { category, description, name, price, quantity }: CreateProductDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
    const existUser = await this.userModel.findById(userId);
    if (!existUser) {
      throw new BadRequestException('User not found');
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('Image is required');
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
        imagesArr: imageFileIds.map(
          (fileId) => `${process.env.CLOUD_FRONT_URL}/${fileId}`,
        ),
      },
    };
  }

  async findAll(subscriptionActive: boolean) {
    const products = await this.productModel
      .find()
      .populate({ path: 'owner', select: 'FirstName email' });

    return products.map((product) => {
      const productObj = product.toObject();

      if (productObj.imagesArr && productObj.imagesArr.length > 0) {
        productObj.imagesArr = productObj.imagesArr.map(
          (fileId) => `${process.env.CLOUD_FRONT_URL}/${fileId}`,
        );
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

  async findOne(id: string, subscriptionActive: boolean) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id is invalid');
    }

    const product = await this.productModel
      .findById(id)
      .populate({ path: 'owner', select: 'FirstName email' });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productObj = product.toObject();

    if (productObj.imagesArr && productObj.imagesArr.length > 0) {
      productObj.imagesArr = productObj.imagesArr.map(
        (fileId) => `${process.env.CLOUD_FRONT_URL}/${fileId}`,
      );
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

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const existProduct = await this.productModel.findById(id);
    if (!existProduct) {
      throw new NotFoundException('Product not found');
    }
    if (existProduct.owner.toString() !== userId) {
      throw new BadRequestException('It is not your product');
    }

    const updateReq: Partial<UpdateProductDto> = {};
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

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateReq,
      { new: true },
    );
    return {
      message: 'ok',
      product: updatedProduct,
    };
  }

  deleteFileById(fileId: string) {
    if (!fileId) throw new BadRequestException('FileId is required');
    return this.awsService.deleteFileById(fileId);
  }

  async remove(id: string, userId: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.owner.toString() !== userId) {
      throw new BadRequestException('It is not your product');
    }

    await this.productModel.findByIdAndDelete(id);
    if (product.imagesArr && product.imagesArr.length > 0) {
      await Promise.all(
        product.imagesArr.map((fileId) =>
          this.awsService.deleteFileById(fileId),
        ),
      );
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { products: new Types.ObjectId(id) },
    });
    return `Product deleted successfully `;
  }
}
