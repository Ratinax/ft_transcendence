import { DataSource } from 'typeorm';
import { Blockships } from './blockship.entity';
export declare const blockshipProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Blockships>;
    inject: string[];
}[];
