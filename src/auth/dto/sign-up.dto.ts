import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;
}
