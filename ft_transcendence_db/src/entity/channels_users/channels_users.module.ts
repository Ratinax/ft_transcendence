import { Module } from '@nestjs/common';
import { ChannelsUsersController } from './channels_users.controller';
import { ChannelsUsersService } from './channels_users.service';
import { channelsUsersProviders } from './channels_users.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ChannelsUsersGateway } from './channels_users.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...channelsUsersProviders,
    ChannelsUsersService,
    ChannelsUsersGateway,
  ],
    controllers: [ChannelsUsersController],
})
export class ChannelsUsersModule {}
