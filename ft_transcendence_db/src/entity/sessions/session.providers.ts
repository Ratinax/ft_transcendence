
import { DataSource } from 'typeorm';
import { Sessions } from './session.entity';

/**
 * sessionProviders, needs to be injected to create a session repository
 * - to use : '@Inject('MESSAGE_REPOSITORY')'
 */
export const sessionProviders = [
  {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Sessions),
    inject: ['DATA_SOURCE'],
  },
];