import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { channelProviders } from './channel.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ChannelGateway } from './channel.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...channelProviders,
    ChannelService,
    ChannelGateway
  ],
    controllers: [ChannelController],
})
export class ChannelModule {}
