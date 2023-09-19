
import { DataSource } from 'typeorm';
import { Friendships } from './friendship.entity';

/**
 * friendshipProviders, needs to be injected to create a friendship repository
 * - to use : '@Inject('FRIENDSHIP_REPOSITORY')'
 */
export const friendshipProviders = [
  {
    provide: 'FRIENDSHIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Friendships),
    inject: ['DATA_SOURCE'],
  },
];