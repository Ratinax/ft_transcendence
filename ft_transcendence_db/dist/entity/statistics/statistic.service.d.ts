import { Repository } from 'typeorm';
import { Statistics } from './statistic.entity';
export declare class StatisticService {
    private statisticRepository;
    constructor(statisticRepository: Repository<Statistics>);
    findAll(): Promise<Statistics[]>;
}
