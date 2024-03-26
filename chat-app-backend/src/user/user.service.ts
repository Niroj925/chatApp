import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { userEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { roomEntity } from 'src/entities/room.entity';
import { chatEntity } from 'src/entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepository:Repository<userEntity>,

    @InjectRepository(roomEntity)
    private readonly roomRepository:Repository<roomEntity>,

    @InjectRepository(chatEntity)
    private readonly chatRepository:Repository<chatEntity>
  ){}
  async create(createUserDto: CreateUserDto) {
    const user= this.userRepository.create({
      ...createUserDto
    })
    await this.userRepository.save(user);
    return user;
  }

  async login(createUserDto:CreateUserDto){
    const user=await this.userRepository.findOne({where:{email:createUserDto.email}});

    if(user.password===createUserDto.password){
      return {success:true,id:user.id}
    }else{
      throw new ForbiddenException('invalid credentials');
    }
  }

  async createFrn(user1:string,user2:string){
    const frnExist=await this.roomRepository.findOne({
      // where:{firstuser:user1||user2,seconduser:user1||user2}
      where: [
        { firstuser: user1, seconduser: user2 },
        { firstuser: user2, seconduser: user1 }
    ]
    })
    if(frnExist){
      return {msg:'user already exist'}
    }
   const room=this.roomRepository.create({
    firstuser:user1,
    seconduser:user2,
   })
   await this.roomRepository.save(room);
   return room
  }

  async findAll() {
    const users=await this.userRepository.find();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

 async findFriend(user1:string,user2:string) {
  const frnExist=await this.roomRepository.findOne({
    // where:{firstuser:user1||user2,seconduser:user1||user2}
    where: [
      { firstuser: user1, seconduser: user2 },
      { firstuser: user2, seconduser: user1 }
  ]
  })
  console.log(frnExist)
  if(frnExist){
    return frnExist;
  }else{
    throw new NotFoundException('frn not found');
  }
   
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }


async creatChat(id:string,roomid:string,createChatDto:CreateChatDto){
const chat=this.chatRepository.create({
  sender:id,
  message:createChatDto.message,
  room:{id:roomid}
});
return chat;
}

async findChat(id:string){
  const chats=await this.chatRepository.find({where:{room:{id}}});
  return chats;
}
}
