import { Module } from '@nestjs/common';
import { UserModule } from './entity/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ChannelModule } from './entity/channels/channel.module';
import { MessageModule } from './entity/messages/message.module';
import { GameModule } from './entity/games/game.module';
import { ChannelsUsersModule } from './entity/channels_users/channels_users.module';
import { BlockshipModule } from './entity/blockships/blockship.module';
import { FriendshipModule } from './entity/friendships/friendship.module';
import { SessionModule } from './entity/sessions/session.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // configure
    UserModule, 
    ChannelModule, 
    MessageModule, 
    GameModule, 
    ChannelsUsersModule,
    BlockshipModule,
    FriendshipModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
