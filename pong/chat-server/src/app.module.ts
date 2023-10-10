import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [MessagesModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
