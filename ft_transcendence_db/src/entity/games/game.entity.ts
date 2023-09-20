import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
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
 * - isGameOver: boolean
 * - ballSpeed: number
 * - ballSpeedInc :number
 * - racketSpeed: number
 * - racketSize: number
 * - scoreToWin: number
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

    @Column({ name: 'is_game_over', default: 0 })
    isGameOver: Boolean;

    @Column({ name: 'ball_speed', default: 0 })
    ballSpeed: number;

    @Column({ name: 'ball_speed_inc', default: 0 })
    ballSpeedInc: number;

    @Column({ name: 'racket_speed', default: 0 })
    racketSpeed: number;

    @Column({ name: 'racket_size', default: 0 })
    racketSize: number;

    @Column({ name: 'score_to_win', default: 0 })
    scoreToWin: number;


}