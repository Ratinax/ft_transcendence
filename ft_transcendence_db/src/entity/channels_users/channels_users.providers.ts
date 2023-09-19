
import { DataSource } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';

/**
 * channelsUsersProviders, needs to be injected to create a channelsUsers repository
 * - to use : '@Inject('CHANNELSUSERS_REPOSITORY')'
 */
export const channelsUsersProviders = [
  {
    provide: 'CHANNELSUSERS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChannelsUsers),
    inject: ['DATA_SOURCE'],
  },
];