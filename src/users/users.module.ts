import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './entities/user.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    AwsModule,
    MongooseModule.forFeature([{ schema: userSchema, name: 'user' }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
