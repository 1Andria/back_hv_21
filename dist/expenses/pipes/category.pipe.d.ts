import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class CategoryPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
