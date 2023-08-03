import { Module } from '@nestjs/common';
import { UserModule } from './entity/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ChannelModule } from './entity/channels/channel.module';
import { MessageModule } from './entity/messages/message.module';
import { StatisticModule } from './entity/statistics/statistic.module';
import { ChannelsUsersModule } from './entity/channels_users/channels_users.module';
import { BlockshipModule } from './entity/blockships/blockship.module';
import { FriendshipModule } from './entity/friendships/friendship.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // configure
    UserModule, 
    ChannelModule, 
    MessageModule, 
    StatisticModule, 
    ChannelsUsersModule,
    BlockshipModule,
    FriendshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
