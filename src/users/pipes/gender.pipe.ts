import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class GenderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return;
    }
    const allowed = ['m', 'f'];
    if (value && allowed.includes(value.toLowerCase())) {
      return value.toLowerCase();
    }
    throw new BadRequestException('Gender must be "m" or "f"');
  }
}
