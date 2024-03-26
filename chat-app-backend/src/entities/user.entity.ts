import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class userEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique:true})
    email:string

    @Column()
    password:string
}