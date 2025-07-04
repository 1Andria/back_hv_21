import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class signUpDto {
  @IsNotEmpty()
  @IsString()
  FirstName: string;

  @IsNotEmpty()
  @IsString()
  LastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(9)
  phoneNumber: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
