import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "../users/user.entity";

/**
 * Friendship entity
 * 
 * attributs :
 * - id: number
 * - user: Uer asking for friendship
 * - friend: User being asked as a friend
 * - statu: status of friendship (pending or accepted)
 */
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