import { Module } from '@nestjs/common';
import { ChannelsUsersController } from './channels_users.controller';
import { ChannelsUsersService } from './channels_users.service';
import { channelsUsersProviders } from './channels_users.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ChannelsUsersGateway } from './channels_users.gateway';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';
import { messageProviders } from '../messages/message.providers';
import { MessageService } from '../messages/message.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...channelsUsersProviders,
    ...sessionProviders,
    ...messageProviders,
    ChannelsUsersService,
    ChannelsUsersGateway,
    SessionService,
    MessageService,
  ],
    controllers: [ChannelsUsersController],
})
export class ChannelsUsersModule {}
