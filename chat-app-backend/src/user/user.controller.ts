import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('addfrn')
  addFriend(@Query() query:any){
    const {user1,user2}=query;
     return this.userService.createFrn(user1,user2);
  }

  @Get('frn')
  findFriend(@Query() query:any){
    const {user1,user2}=query;
     return this.userService.findFriend(user1,user2);
  }

  @Post('chat')
  creatChat(@Query() query:any){
    const {sender,room}=query;
     return this.userService.findFriend(sender,room);
  }

  @Get(':id')
  findChat(@Param('id') id: string) {
    return this.userService.findChat(id);
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Post('login')
  login(@Body() createUserDto:CreateUserDto){
    return this.userService.login(createUserDto)
  }
}
