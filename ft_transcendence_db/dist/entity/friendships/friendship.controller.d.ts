import { FriendshipService } from './friendship.service';
import { SessionService } from '../sessions/session.service';
export declare class FriendshipController {
    private readonly friendshipService;
    private readonly sessionService;
    constructor(friendshipService: FriendshipService, sessionService: SessionService);
    findFriendOfId(req: any): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
    findPending(req: any): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
}
