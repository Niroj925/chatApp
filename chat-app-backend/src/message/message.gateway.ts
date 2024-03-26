import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService} from './message.service'; // Import messageService

@WebSocketGateway({
  namespace:'message',
    cors: {
        origin: "*"
    }
})
export class MessageGateway {
   
    constructor(private readonly messageService: MessageService) {} 

    @WebSocketServer()
    server: Server;

    @SubscribeMessage("createMessage")
    async create(@MessageBody() createMessageDto: CreateMessageDto) {
        const message = await this.messageService.create(createMessageDto);
        // this.server.emit('message',message);
        this.server.to(createMessageDto.room).emit('message', message)
        
        return message;
    }

   @SubscribeMessage("join")
   joinRoom(@MessageBody() room:string,@ConnectedSocket() client:Socket){
    client.join(room); 
    console.log(`client ${client.id} set roomName:${room}`);
    // return this.messageService.identifyClient(room,client.id);
   }
}
