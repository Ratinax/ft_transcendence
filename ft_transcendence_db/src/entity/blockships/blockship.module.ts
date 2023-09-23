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

@Module({
  imports: [DatabaseModule],
  providers: [
    ...blockshipProviders,
    ...sessionProviders,
    ...userProviders,
    BlockshipService,
    BlockshipGateway,
    SessionService,
    UserService,
  ],
    controllers: [BlockshipController],
})
export class BlockshipModule {}
