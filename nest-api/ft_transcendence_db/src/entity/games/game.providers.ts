
import { DataSource } from 'typeorm';
import { Games } from './game.entity';

/**
 * statisticProviders, needs to be injected to create a statistic repository
 * - to use : '@Inject('STATISTIC_REPOSITORY')'
 */
export const gameProviders = [
  {
    provide: 'GAME_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Games),
    inject: ['DATA_SOURCE'],
  },
];