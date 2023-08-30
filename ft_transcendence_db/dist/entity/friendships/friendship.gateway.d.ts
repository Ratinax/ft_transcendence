import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';
export declare class FriendshipGateway {
    private readonly friendshipService;
    private readonly sessionService;
    server: Server;
    constructor(friendshipService: FriendshipService, sessionService: SessionService);
    acceptFriendship(body: any): Promise<string>;
    removeFriendship(body: any): Promise<string>;
}
