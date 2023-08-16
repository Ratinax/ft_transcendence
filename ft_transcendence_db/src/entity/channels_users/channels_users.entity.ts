import { Channels } from "../channels/channel.entity";
import { Users } from "../users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";


/**
 * ChannelsUser entity
 * 
 * attributs :
 * - id: number
 * - user: User
 * - channel: Channel
 * - isAdmin: boolean
 * - isOwner: boolean
 * - isInvited: boolean
 * - isBanned: boolean
 */

// TODO faire les invitations
@Entity()
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

    @Column({ name: 'is_invited', default: false })
    isInvited: boolean;

    @Column({ name: 'is_banned', default: false })
    isBanned: boolean;

    @Column({ name: 'date_timeout', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    dateTimeout: Date;

    @Column({name: 'duration_timeout', type: 'integer', default: 0})
    durationTimeout: Number;
}