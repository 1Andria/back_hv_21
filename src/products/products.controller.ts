import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Headers,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsEmailActiveGuard } from 'src/common/guards/isEmailActive.guard';
import { HasUserId } from 'src/common/guards/has-user-id.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(new HasUserId())
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Headers('user-id') userId: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.create(createProductDto, userId, files);
  }

  @Get()
  @UseGuards(IsEmailActiveGuard)
  findAll(@Req() req) {
    const hasDiscount = req.subscriptionActive;
    return this.productsService.findAll(hasDiscount);
  }

  @Get(':id')
  @UseGuards(IsEmailActiveGuard)
  findOne(@Param('id') id: string, @Req() req) {
    const hasDiscount = req.subscriptionActive;

    return this.productsService.findOne(id, hasDiscount);
  }

  @Patch(':id')
  @UseGuards(new HasUserId())
  update(
    @Headers('user-id') userId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Delete('file')
  deleteFile(@Body('fileId') fileId: string) {
    return this.productsService.deleteFileById(fileId);
  }

  @Delete(':id')
  @UseGuards(new HasUserId())
  remove(@Headers('user-id') userId: string, @Param('id') id: string) {
    return this.productsService.remove(id, userId);
  }
}
