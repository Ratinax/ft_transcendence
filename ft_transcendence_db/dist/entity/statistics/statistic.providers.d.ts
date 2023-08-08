import { DataSource } from 'typeorm';
import { Statistics } from './statistic.entity';
export declare const statisticProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Statistics>;
    inject: string[];
}[];
