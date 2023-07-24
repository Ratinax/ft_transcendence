
import { DataSource } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';

export const channelsUsersProviders = [
  {
    //@Respository() test: ,
    provide: 'CHANNELSUSERS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChannelsUsers),
    inject: ['DATA_SOURCE'],
  },
];