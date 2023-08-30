import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { friendshipProviders } from './friendship.providers';
import { DatabaseModule } from 'src/database/database.module';
import { FriendshipGateway } from './friendship.gateway';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...friendshipProviders,
    ...sessionProviders,
    FriendshipService,
    FriendshipGateway,
    SessionService,
  ],
    controllers: [FriendshipController],
})
export class FriendshipModule {

}
