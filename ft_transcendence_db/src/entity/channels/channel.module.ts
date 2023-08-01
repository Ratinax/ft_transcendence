import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { channelProviders } from './channel.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ChannelGateway } from './channel.gateway';
// import { ChannelsUsersModule } from '../channels_users/channels_users.module';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { channelsUsersProviders } from '../channels_users/channels_users.providers';


@Module({
  imports: [DatabaseModule],
  providers: [
    ...channelProviders,
    ...channelsUsersProviders,
    ChannelService,
    ChannelGateway,
    ChannelsUsersService,
  ],
    controllers: [ChannelController],
})
export class ChannelModule {}
