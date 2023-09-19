
import { DataSource } from 'typeorm';
import { Statistics } from './statistic.entity';

/**
 * statisticProviders, needs to be injected to create a statistic repository
 * - to use : '@Inject('STATISTIC_REPOSITORY')'
 */
export const statisticProviders = [
  {
    provide: 'STATISTIC_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Statistics),
    inject: ['DATA_SOURCE'],
  },
];