import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { gameProviders } from './game.providers';
import { DatabaseModule } from 'src/database/database.module';
import { SessionService } from '../sessions/session.service';
import { sessionProviders } from '../sessions/session.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...gameProviders,
    ...sessionProviders,
    GameService,
    SessionService
  ],
    controllers: [GameController],
})
export class GameModule {}
