import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * User entity
 * 
 * attributs :
 * - id: number
 * - pseudo: string
 * - password: string
 * - profilPic: string
 * - is42User : Boolean
 */
@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 20, unique: true })
    pseudo: string;
    
    @Column({ type: 'varchar', length: 100, default: ''})
    password: string;

    @Column({ name: 'profil_pic', type: 'varchar', nullable: true })
    profilPic: string;

    @Column({name: 'is_42_user', type: 'boolean', default: false})
    is42User: Boolean;

    @Column({name: 'double_fa', type: 'boolean', default: false})
    doubleFa: Boolean;

    @Column({name: 'double_fa_ascii', type: 'varchar', default: ''})
    doubleFaAscii: String;

    @Column({name: 'double_fa_url', type: 'varchar', default: ''})
    doubleFaURL: String;
}