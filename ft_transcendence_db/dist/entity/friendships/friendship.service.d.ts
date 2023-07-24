import { Repository } from 'typeorm';
import { Friendships } from './friendship.entity';
export declare class FriendshipService {
    private friendshipRepository;
    constructor(friendshipRepository: Repository<Friendships>);
    findAll(): Promise<Friendships[]>;
}
