import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * User entity
 * 
 * attributs :
 * - id: number
 * - pseudo: string
 * - password: string
 * - profilPic: string
 * - isConnected: boolean
 */
@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 20, unique: true })
    pseudo: string;
    
    @Column({ type: 'varchar', length: 100})
    password: string;

    @Column({ name: 'profil_pic', type: 'varchar', nullable: true })
    profilPic: string;
    
    @Column({ name: 'is_connected', default: false })
    isConnected: boolean;

}