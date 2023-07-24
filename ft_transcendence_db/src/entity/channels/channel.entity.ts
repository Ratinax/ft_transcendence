import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

    @Column({ name: 'category' })
    category: string;

}