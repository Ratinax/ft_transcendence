import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { channelProviders } from './channel.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ChannelGateway } from './channel.gateway';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { channelsUsersProviders } from '../channels_users/channels_users.providers';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { userProviders } from '../users/user.providers';
import { messageProviders } from '../messages/message.providers';
import { MessageService } from '../messages/message.service';


@Module({
  imports: [DatabaseModule],
  providers: [
    ...channelProviders,
    ...channelsUsersProviders,
    ...sessionProviders,
    ...userProviders,
    ...messageProviders,
    ChannelService,
    ChannelGateway,
    ChannelsUsersService,
    SessionService,
    UserService,
    MessageService,
  ],
    controllers: [ChannelController],
})
export class ChannelModule {}
