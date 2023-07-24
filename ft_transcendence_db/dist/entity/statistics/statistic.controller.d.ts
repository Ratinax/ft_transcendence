import { StatisticService } from './statistic.service';
export declare class StatisticController {
    private readonly statisticService;
    constructor(statisticService: StatisticService);
    findAll(): Promise<import("./statistic.entity").Statistics[]>;
}
