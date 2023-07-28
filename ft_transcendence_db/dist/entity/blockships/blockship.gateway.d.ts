import { BlockshipService } from './blockship.service';
import { Server } from 'socket.io';
export declare class BlockshipGateway {
    private readonly blockshipService;
    server: Server;
    constructor(blockshipService: BlockshipService);
    refuseBlockship(body: any): Promise<void>;
}
