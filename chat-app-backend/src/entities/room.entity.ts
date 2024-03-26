import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { chatEntity } from "./chat.entity";

@Entity('room')
export class roomEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    firstuser:string

    @Column()
    seconduser:string

    @OneToMany(()=>chatEntity,(chat)=>chat.room)
    chat:chatEntity[]
}