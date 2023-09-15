import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Users } from "../users/user.entity";

/**
 * Statistic entity
 * 
 * attributs :
 * - id: number
 * - playerOne : User
 * - playerTwo : User
 * - scorePOne: number
 * - scorePTwo: number
 * - isGameOver: boolean
 */
@Entity()
export class Statistics {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'player_one' })
    playerOne: Users;

    @OneToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'player_two' })
    playerTwo: Users;

    @Column({ name: 'score_p_one', default: 0 })
    scorePOne: number;

    @Column({ name: 'score_p_two', default: 0 })
    scorePTwo: number;

    @Column({ name: 'is_game_over', default: 0 })
    isGameOver: Boolean;

}