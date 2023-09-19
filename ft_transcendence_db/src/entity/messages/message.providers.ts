
import { DataSource } from 'typeorm';
import { Messages } from './message.entity';

/**
 * messageProviders, needs to be injected to create a message repository
 * - to use : '@Inject('MESSAGE_REPOSITORY')'
 */
export const messageProviders = [
  {
    provide: 'MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Messages),
    inject: ['DATA_SOURCE'],
  },
];