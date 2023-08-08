import { DataSource } from 'typeorm';
import { Messages } from './message.entity';
export declare const messageProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Messages>;
    inject: string[];
}[];
