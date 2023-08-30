import { FriendshipService } from './friendship.service';
import { SessionService } from '../sessions/session.service';
export declare class FriendshipController {
    private readonly friendshipService;
    private readonly sessionService;
    constructor(friendshipService: FriendshipService, sessionService: SessionService);
    findFriendOfId(id: number, req: any): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
    findPending(id: number, req: any): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
}
