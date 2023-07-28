import { Module } from '@nestjs/common';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';
import { friendshipProviders } from './friendship.providers';
import { DatabaseModule } from 'src/database/database.module';
import { FriendshipGateway } from './friendship.gateway';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...friendshipProviders,
    FriendshipService,
    FriendshipGateway,
  ],
    controllers: [FriendshipController],
})
export class FriendshipModule {

}
