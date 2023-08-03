
import { DataSource } from 'typeorm';
import { Blockships } from './blockship.entity';


/**
 * blockshipProvider, needs to be injected to create a blockship repository
 * - to use : '@Inject('BLOCKSHIP_REPOSITORY')'
 */
export const blockshipProviders = [
  {
    provide: 'BLOCKSHIP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Blockships),
    inject: ['DATA_SOURCE'],
  },
];