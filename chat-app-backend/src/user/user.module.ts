import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from 'src/entities/user.entity';
import { chatEntity } from 'src/entities/chat.entity';
import { roomEntity } from 'src/entities/room.entity';

@Module({
  imports:[TypeOrmModule.forFeature([userEntity,chatEntity,roomEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
