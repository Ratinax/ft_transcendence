
import { DataSource } from 'typeorm';
import { Friendships } from './friendship.entity';

export const friendshipProviders = [
  {
    //@Respository() test: ,
    provide: 'FRIENDSHIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Friendships),
    inject: ['DATA_SOURCE'],
  },
];