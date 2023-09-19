
import { DataSource } from 'typeorm';
import { Users } from './user.entity';

/**
 * userProvider, needs to be injected to create a user repository
 * - to use : '@Inject('USER_REPOSITORY')'
 */
export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Users),
    inject: ['DATA_SOURCE'],
  },
];