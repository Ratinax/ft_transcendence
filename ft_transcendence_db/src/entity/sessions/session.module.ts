import { Module } from '@nestjs/common';
import { sessionProviders } from './session.providers';
import { SessionService } from './session.service';
import { DatabaseModule } from 'src/database/database.module';
import { SessionGateway } from './session.gateway';
import { SessionController } from './session.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...sessionProviders,
    SessionService,
    SessionGateway,
  ],
    controllers: [SessionController],
})
export class SessionModule {}
