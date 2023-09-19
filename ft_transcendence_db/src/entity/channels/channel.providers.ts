import { DataSource } from 'typeorm';
import { Channels } from './channel.entity';

/**
 * channelProvider, needs to be injected to create a channel repository
 * - to use : '@Inject('CHANNEL_REPOSITORY')'
 */
export const channelProviders = [
  {
    provide: 'CHANNEL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Channels),
    inject: ['DATA_SOURCE'],
  },
];