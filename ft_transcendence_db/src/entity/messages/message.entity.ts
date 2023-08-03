import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "../users/user.entity";
import { Channels } from "../channels/channel.entity";

/**
 * Messsage entity
 * 
 * attributs :
 * - id: number
 * - user: User
 * - channel: Channel
 * - dateSent: Date
 * - content: string
 */

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Channels, { eager: true })
  @JoinColumn({ name: 'channel_id' })
  channel: Channels;

  @Column({ name: 'date_sent', type: 'timestamp' })
  dateSent: Date;

  @Column({ type: 'text' })
  content: string;
}