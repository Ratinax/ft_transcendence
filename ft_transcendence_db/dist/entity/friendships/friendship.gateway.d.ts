import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';
export declare class FriendshipGateway {
    private readonly friendshipService;
    server: Server;
    constructor(friendshipService: FriendshipService);
    acceptFriendship(body: any): Promise<void>;
    refuseFriendship(body: any): Promise<void>;
}
