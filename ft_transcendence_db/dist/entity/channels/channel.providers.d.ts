import { DataSource } from 'typeorm';
import { Channels } from './channel.entity';
export declare const channelProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Channels>;
    inject: string[];
}[];
