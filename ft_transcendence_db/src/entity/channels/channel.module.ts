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


@Module({
  imports: [DatabaseModule],
  providers: [
    ...channelProviders,
    ...channelsUsersProviders,
    ...sessionProviders,
    ChannelService,
    ChannelGateway,
    ChannelsUsersService,
    SessionService,
  ],
    controllers: [ChannelController],
})
export class ChannelModule {}
