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

    @Column({ name: 'ball_accel', default: 0 })
    ballAccel: number;
    
    @Column({ name: 'ball_size', default: 0 })
    ballSize: number;
    
    @Column({ name: 'ball_speed', default: 0 })
    ballSpeed: number;

    @Column({ name: 'max_angle', default: 0 })
    maxAngle: number;

    @Column({ name: 'player_speed', default: 0 })
    playerSpeed: number;

    @Column({ name: 'player_size', default: 0 })
    playerSize: number;

    @Column({ name: 'win_score', default: 0 })
    winScore: number;


}