import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { friendshipProviders } from './friendship.providers';
import { DatabaseModule } from 'src/database/database.module';
import { FriendshipGateway } from './friendship.gateway';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';
import { userProviders } from '../users/user.providers';
import { UserService } from '../users/user.service';
import { BlockshipService } from '../blockships/blockship.service';
import { blockshipProviders } from '../blockships/blockship.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...friendshipProviders,
    ...sessionProviders,
    ...userProviders,
    ...blockshipProviders,
    FriendshipService,
    FriendshipGateway,
    SessionService,
    UserService,
    BlockshipService,
  ],
    controllers: [FriendshipController],
})
export class FriendshipModule {

}
