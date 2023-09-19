import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { messageProviders } from './message.providers';
import { DatabaseModule } from 'src/database/database.module';
import { MessagesGateway } from './message.gateway';
import { channelsUsersProviders } from '../channels_users/channels_users.providers';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { blockshipProviders } from '../blockships/blockship.providers';
import { BlockshipService } from '../blockships/blockship.service';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...messageProviders,
    ...channelsUsersProviders,
    ...blockshipProviders,
    ...sessionProviders,
    MessageService,
    MessagesGateway,
    ChannelsUsersService,
    BlockshipService,
    SessionService,
  ],
    controllers: [MessageController],
})
export class MessageModule {}
