import { Module } from '@nestjs/common';
import { BlockshipController } from './blockship.controller';
import { BlockshipService } from './blockship.service';
import { blockshipProviders } from './blockship.providers';
import { DatabaseModule } from 'src/database/database.module';
import { BlockshipGateway } from './blockship.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...blockshipProviders,
    BlockshipService,
    BlockshipGateway,
  ],
    controllers: [BlockshipController],
})
export class BlockshipModule {}
