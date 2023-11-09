import { Module } from '@nestjs/common';
import { BlockshipController } from './blockship.controller';
import { BlockshipService } from './blockship.service';
import { blockshipProviders } from './blockship.providers';
import { DatabaseModule } from 'src/database/database.module';
import { BlockshipGateway } from './blockship.gateway';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';
import { userProviders } from '../users/user.providers';
import { UserService } from '../users/user.service';
import { FriendshipService } from '../friendships/friendship.service';
import { friendshipProviders } from '../friendships/friendship.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...blockshipProviders,
    ...sessionProviders,
    ...userProviders,
    ...friendshipProviders,
    BlockshipService,
    BlockshipGateway,
    SessionService,
    UserService,
    FriendshipService,
  ],
    controllers: [BlockshipController],
})
export class BlockshipModule {}
