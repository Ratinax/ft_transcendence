
import { DataSource } from 'typeorm';
import { Channels } from './channel.entity';

export const channelProviders = [
  {
    provide: 'CHANNEL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Channels),
    inject: ['DATA_SOURCE'],
  },
];