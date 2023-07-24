
import { DataSource } from 'typeorm';
import { Statistics } from './statistic.entity';

export const statisticProviders = [
  {
    provide: 'STATISTIC_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Statistics),
    inject: ['DATA_SOURCE'],
  },
];