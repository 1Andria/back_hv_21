import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpgradeSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
