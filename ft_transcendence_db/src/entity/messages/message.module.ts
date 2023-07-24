import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { messageProviders } from './message.providers';
import { DatabaseModule } from 'src/database/database.module';
import { MessagesGateway } from './message.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...messageProviders,
    MessageService,
    MessagesGateway,
  ],
    controllers: [MessageController],
})
export class MessageModule {}
