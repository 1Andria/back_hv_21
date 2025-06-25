import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dtp';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
