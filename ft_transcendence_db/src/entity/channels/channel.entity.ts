import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * User entity
 * 
 * attributs :
 * - channel_id: number
 * - password: string
 * - name: string
 * - isADm: boolean
 * - category: string (Public, Private or Protected by password)
 */
@Entity()
export class Channels {
    @PrimaryGeneratedColumn()
    channel_id: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    password: string;

    @Column({ name: 'is_a_dm', default: false })
    isADm: boolean;

    @Column({ type: 'varchar', length: 100, name:'name' })
    name: string;

    @Column({ name: 'category' }) // Public, Private or Protected by password
    category: string; 

}