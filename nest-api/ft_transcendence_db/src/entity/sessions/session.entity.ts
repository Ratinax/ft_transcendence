import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { Users } from "../users/user.entity";

/**
 * User entity
 * 
 * attributs :
 * - id: number
 * - user: User
 * - sessionKey: string
 * - expirationDate: boolean
 */
@Entity()
export class Sessions {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => Users, { eager: true })
    @JoinColumn({ name: 'user_id'})
    user: Partial<Users>;
    
    @Column({name:'session_key', type: 'varchar', length: 100})
    sessionKey: string;
    
    @Column({ name: 'expiration_date', type: 'timestamp'})
    expirationDate: Date;

}