import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Statistics } from './statistic.entity';

@Injectable()
export class StatisticService {
    constructor(
        @Inject('STATISTIC_REPOSITORY')
        private statisticRepository: Repository<Statistics>,
    ) {}
}
