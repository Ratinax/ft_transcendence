import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Friendships } from './friendship.entity';

@Injectable()
export class FriendshipService {
    constructor(
        @Inject('FRIENDSHIP_REPOSITORY')
        private friendshipRepository: Repository<Friendships>,
    ) {}
    async findAll(): Promise<Friendships[]>
    {
        return this.friendshipRepository.find();
    }
}
