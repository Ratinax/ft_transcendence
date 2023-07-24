import { Users } from "../users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Blockships {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'userblocking_id' })
    userblocking: Users;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'userblocked_id' })
    userblocked: Users;

}