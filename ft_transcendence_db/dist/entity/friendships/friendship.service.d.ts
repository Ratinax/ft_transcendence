import { Repository } from 'typeorm';
import { Friendships } from './friendship.entity';
export declare class FriendshipService {
    private friendshipRepository;
    constructor(friendshipRepository: Repository<Friendships>);
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
    acceptFriendship(friend_id: number, user_id: number): Promise<Friendships>;
    deleteFriendship(friend_id: number, user_id: number): Promise<import("typeorm").DeleteResult>;
}
