import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "../users/user.entity";
import { Channels } from "../channels/channel.entity";
import { Games } from "../games/game.entity";

/**
 * Messsage entity
 * 
 * attributs :
 * - id: number
 * - user: User
 * - channel: Channel
 * - dateSent: Date
 * - content: string
 * - isAGameInvite: boolean
 */

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Partial<Users>;

  @ManyToOne(() => Channels, { eager: true })
  @JoinColumn({ name: 'channel_id' })
  channel: Partial<Channels>;

  @Column({ name: 'date_sent', type: 'timestamp' })
  dateSent: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({default: false})
  isAGameInvite: Boolean;

  @ManyToOne(() => Games, { eager: true, nullable: true})
  @JoinColumn({ name: 'game' })
  game: Partial<Games>;
}