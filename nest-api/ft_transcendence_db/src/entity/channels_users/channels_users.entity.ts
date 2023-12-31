import { Channels } from "../channels/channel.entity";
import { Users } from "../users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from "typeorm";


/**
 * ChannelsUser entity
 * 
 * attributs :
 * - id: number
 * - user: User
 * - channel: Channel
 * - isAdmin: boolean
 * - isOwner: boolean
 * - isBanned: boolean
 * - dateTimeout: Date
 * - durationTimeout: Number
 * - isHide: boolean
 */

@Entity()
@Unique(['user', 'channel'])
export class ChannelsUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: Partial<Users>;

    @ManyToOne(() => Channels, { eager: true })
    @JoinColumn({ name: 'channel_id' })
    channel: Partial<Channels>;

    @Column({ name: 'is_admin', default: false })
    isAdmin: boolean;

    @Column({ name: 'is_owner', default: false })
    isOwner: boolean;

    @Column({ name: 'is_banned', default: false })
    isBanned: boolean;

    @Column({ name: 'date_timeout', type: 'timestamp', default: () => 'TO_TIMESTAMP(0)'})
    dateTimeout: Date;

    @Column({name: 'duration_timeout', type: 'integer', default: 0})
    durationTimeout: Number;

    @Column({ name: 'is_hide', default: false })
    isHide: boolean;
}