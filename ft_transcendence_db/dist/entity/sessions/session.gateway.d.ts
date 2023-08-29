import { SessionService } from './session.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
export declare class SessionGateway implements OnModuleInit {
    private readonly sessionService;
    server: Server;
    constructor(sessionService: SessionService);
    onModuleInit(): void;
    pingUsersThread(): void;
    pingUsers(): Promise<void>;
}
