import { BlockshipService } from './blockship.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';
export declare class BlockshipGateway {
    private readonly blockshipService;
    private readonly sessionService;
    server: Server;
    constructor(blockshipService: BlockshipService, sessionService: SessionService);
    refuseBlockship(body: any): Promise<string>;
}
