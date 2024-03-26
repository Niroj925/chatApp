import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  message:CreateMessageDto[]=[{room:"niroj",text:'Hello'}];

  clientUser={};

  identifyClient(room:string,clientId:string){
    this.clientUser[clientId]=room;
    return Object.values(this.clientUser);
  }

  getClientName(clientId:string){
    return this.clientUser[clientId]
  }


  create(createMessageDto: CreateMessageDto) {
    const message={...createMessageDto};
    this.message.push(message);

    return message;
  }

  findAll() {
    return this.message;
  }

}
