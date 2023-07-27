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
    async findFriendOfId(id: number)
    {
        const friendshipsFromFriend = await this.friendshipRepository
            .createQueryBuilder('blockships')
            .innerJoinAndSelect('user.user', 'user')
            .innerJoinAndSelect('friend.user', 'user')
            .where(`user.id = ${id} AND statu = 'accepted'`)
            .getMany();
        const friendshipsFromUser = await this.friendshipRepository
            .createQueryBuilder('blockships')
            .innerJoinAndSelect('user.user', 'user')
            .innerJoinAndSelect('friend.user', 'user')
            .where(`friend.id = ${id} AND statu = 'accepted'`)
            .getMany();
        
        const usersFromFriend = friendshipsFromFriend.map((friendship) => ({
            id: friendship.friend.id, 
            pseudo: friendship.friend.pseudo, 
            profilPic: friendship.friend.profilPic, 
            isConnected: friendship.friend.isConnected}));
        const usersFromUser = friendshipsFromFriend.map((friendship) => ({
            id: friendship.user.id, 
            pseudo: friendship.user.pseudo, 
            profilPic: friendship.user.profilPic, 
            isConnected: friendship.user.isConnected}));
        return ([...usersFromFriend, ...usersFromFriend]);
    }
}
