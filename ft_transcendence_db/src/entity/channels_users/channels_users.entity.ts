import { Channels } from "../channels/channel.entity";
import { Users } from "../users/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class ChannelsUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @ManyToOne(() => Channels, { eager: true })
    @JoinColumn({ name: 'channel_id' })
    channel: Channels;

    @Column({ name: 'is_admin', default: false })
    isAdmin: boolean;

    @Column({ name: 'is_owner', default: false })
    isOwner: boolean;

    @Column({ name: 'is_invited', default: false })
    isInvited: boolean;
}