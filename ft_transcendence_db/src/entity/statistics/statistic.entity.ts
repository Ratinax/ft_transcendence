import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Users } from "../users/user.entity";

/**
 * Statistic entity
 * 
 * attributs :
 * - id: number
 * - user: User
 * - nbVictory: number
 * - nbDefeat: number
 */
@Entity()
export class Statistics {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: Users;

    @Column({ name: 'nb_victory', default: 0 })
    nbVictory: number;

    @Column({ name: 'nb_defeat', default: 0 })
    nbDefeat: number;

}