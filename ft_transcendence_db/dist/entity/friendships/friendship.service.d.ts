import { Repository } from 'typeorm';
import { Friendships } from './friendship.entity';
export declare class FriendshipService {
    private friendshipRepository;
    constructor(friendshipRepository: Repository<Friendships>);
    findAll(): Promise<Friendships[]>;
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
