import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserRoleDto {
  @IsNotEmpty()
  @IsString()
  targetUserEmail: string;
}
