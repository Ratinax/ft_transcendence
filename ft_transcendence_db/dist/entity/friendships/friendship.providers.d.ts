import { DataSource } from 'typeorm';
import { Friendships } from './friendship.entity';
export declare const friendshipProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Friendships>;
    inject: string[];
}[];
