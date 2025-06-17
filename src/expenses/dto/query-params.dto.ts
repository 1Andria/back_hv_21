import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Math.min(Number(value), 30))
  @IsNumber()
  take: number = 30;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  priceFrom?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  priceTo?: number;
}
