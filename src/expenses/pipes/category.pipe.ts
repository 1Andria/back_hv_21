import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CategoryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const knownCategories = ['shopping', 'groceries', 'food'];

    if (value && !knownCategories.includes(value)) {
      throw new BadRequestException('Uknown category');
    }
    return value;
  }
}
