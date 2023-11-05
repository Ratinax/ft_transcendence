import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Users } from "../users/user.entity";

/**
 * Games entity
 * 
 * attributs :
 * - id: number
 * - playerOne : User
 * - playerTwo : User
 * - scorePOne: number
 * - scorePTwo: number
 * - mode: number
 */

@Entity()
export class Games {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'player_one' })
    playerOne: Partial<Users>;

    @ManyToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'player_two' })
    playerTwo: Partial<Users>;

    @Column({ name: 'score_p_one', default: 0 })
    scorePOne: number;

    @Column({ name: 'score_p_two', default: 0 })
    scorePTwo: number;

    @Column({name: 'mode', default: 1})
    mode: number;
}