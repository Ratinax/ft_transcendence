import { DataSource } from 'typeorm';
import { Users } from './user.entity';
export declare const userProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Users>;
    inject: string[];
}[];
