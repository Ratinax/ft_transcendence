import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { gameProviders } from './game.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...gameProviders,
    GameService,
  ],
    controllers: [GameController],
})
export class GameModule {}
