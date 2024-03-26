import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { roomEntity } from "./room.entity";

@Entity('chat')
export class chatEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    sender:string

    @Column()
    message:string

    @ManyToOne(()=>roomEntity,(room)=>room.chat)
    room:roomEntity

    @CreateDateColumn()
    createdAt: Date;
}