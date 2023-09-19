import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { sessionProviders } from '../sessions/session.providers';
import { SessionService } from '../sessions/session.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...userProviders,
    ...sessionProviders,
    SessionService,
    UserService,
  ],
    controllers: [UserController],
})
export class UserModule {}
