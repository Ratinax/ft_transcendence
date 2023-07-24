import { DataSource } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';
export declare const channelsUsersProviders: {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<ChannelsUsers>;
    inject: string[];
}[];
