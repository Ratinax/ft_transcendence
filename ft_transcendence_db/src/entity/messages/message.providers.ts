
import { DataSource } from 'typeorm';
import { Messages } from './message.entity';

export const messageProviders = [
  {
    provide: 'MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Messages),
    inject: ['DATA_SOURCE'],
  },
];