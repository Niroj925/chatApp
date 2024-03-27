import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { chatEntity } from 'src/entities/chat.entity';

@Module({
  imports:[TypeOrmModule.forFeature([chatEntity])],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}
