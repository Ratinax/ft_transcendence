
import { DataSource } from 'typeorm';
import { Blockships } from './blockship.entity';

export const blockshipProviders = [
  {
    //@Respository() test: ,
    provide: 'BLOCKSHIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Blockships),
    inject: ['DATA_SOURCE'],
  },
];