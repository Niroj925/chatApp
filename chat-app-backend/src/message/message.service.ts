import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { chatEntity } from 'src/entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  // message:CreateMessageDto[]=[{sender:" ", message:"",room:''}];

  @InjectRepository(chatEntity)
  private readonly chatRepositroy:Repository<chatEntity>

  clientUser={};

  identifyClient(room:string,clientId:string){
    this.clientUser[clientId]=room;
    return Object.values(this.clientUser);
  }

  getClientName(clientId:string){
    return this.clientUser[clientId]
  }


  async create(createMessageDto: CreateMessageDto) {
    // const message={...createMessageDto};
    // this.message.push(message);
    const chat=await this.chatRepositroy.create({
      sender:createMessageDto.sender,
      message:createMessageDto.message,
      room:{id:createMessageDto.room}
    });

    await this.chatRepositroy.save(chat);

    const chats=await this.chatRepositroy.find({where:{room:{id:createMessageDto.room}}});
    return chats;
  }

  async findAll(id:string) {
    const chats=await this.chatRepositroy.find({where:{room:{id}}})
    return chats;
  }

}
