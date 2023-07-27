import { FriendshipService } from './friendship.service';
export declare class FriendshipController {
    private readonly friendshipService;
    constructor(friendshipService: FriendshipService);
    findAll(): Promise<import("./friendship.entity").Friendships[]>;
    findFriendOfId(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
        isConnected: boolean;
    }[]>;
    findPending(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
        isConnected: boolean;
    }[]>;
}
