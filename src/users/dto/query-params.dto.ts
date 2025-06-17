import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryUserParamDto {
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
  gender?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
