import { Module } from '@nestjs/common';
import { sessionProviders } from './session.providers';
import { SessionService } from './session.service';
import { DatabaseModule } from 'src/database/database.module';
import { SessionGateway } from './session.gateway';
import { SessionController } from './session.controller';
import { messageProviders } from '../messages/message.providers';
import { MessageService } from '../messages/message.service';
import { friendshipProviders } from '../friendships/friendship.providers';
import { FriendshipService } from '../friendships/friendship.service';
import { userProviders } from '../users/user.providers';
import { UserService } from '../users/user.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...sessionProviders,
    ...messageProviders,
    ...friendshipProviders,
    ...userProviders,
    MessageService,
    SessionService,
    SessionGateway,
    FriendshipService,
    UserService,
  ],
    controllers: [SessionController],
})
export class SessionModule {}
