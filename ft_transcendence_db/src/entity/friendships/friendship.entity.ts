import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "../users/user.entity";

@Entity()
export class Friendships {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'friend_id' })
    friend: Users;

    @Column({ type: 'varchar', length: 10, nullable: true })
    statu: string;
}