import { DataSource } from 'typeorm';
import { Games } from './game.entity';
export declare const gameProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Games>;
    inject: string[];
}[];
