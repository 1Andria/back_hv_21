import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class GenderPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
