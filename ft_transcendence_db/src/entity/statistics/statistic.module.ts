import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { statisticProviders } from './statistic.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...statisticProviders,
    StatisticService,
  ],
    controllers: [StatisticController],
})
export class StatisticModule {}
