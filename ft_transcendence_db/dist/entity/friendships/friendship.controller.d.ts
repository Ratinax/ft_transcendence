import { FriendshipService } from './friendship.service';
export declare class FriendshipController {
    private readonly friendshipService;
    constructor(friendshipService: FriendshipService);
    findAll(): Promise<import("./friendship.entity").Friendships[]>;
}
