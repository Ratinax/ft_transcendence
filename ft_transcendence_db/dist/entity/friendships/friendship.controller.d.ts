import { FriendshipService } from './friendship.service';
export declare class FriendshipController {
    private readonly friendshipService;
    constructor(friendshipService: FriendshipService);
    findFriendOfId(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
    findPending(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
}
