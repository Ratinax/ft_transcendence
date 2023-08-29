import { DataSource } from 'typeorm';
import { Sessions } from './session.entity';
export declare const sessionProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Sessions>;
    inject: string[];
}[];
