import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Friendships } from './friendship.entity';

@Injectable()
export class FriendshipService {
    constructor(
        @Inject('FRIENDSHIP_REPOSITORY')
        private friendshipRepository: Repository<Friendships>,
    ) {}

    async findFriendOfId(id: number)
    {
        const friendshipsFromFriend = await this.friendshipRepository
            .createQueryBuilder('friendships')
            .innerJoinAndSelect('friendships.user', 'user')
            .innerJoinAndSelect('friendships.friend', 'friend')
            .where(`user.id = :id AND statu = 'accepted'`, { id: id })
            .getMany();
        const friendshipsFromUser = await this.friendshipRepository
            .createQueryBuilder('friendships')
            .innerJoinAndSelect('friendships.user', 'user')
            .innerJoinAndSelect('friendships.friend', 'friend')
            .where(`friend.id = :id AND statu = 'accepted'`, { id: id })
            .getMany();
        const usersFromFriend = friendshipsFromFriend.map((friendship) => ({
            id: friendship.friend.id, 
            pseudo: friendship.friend.pseudo, 
            profilPic: friendship.friend.profilPic}));
        const usersFromUser = friendshipsFromUser.map((friendship) => ({
            id: friendship.user.id, 
            pseudo: friendship.user.pseudo, 
            profilPic: friendship.user.profilPic}));
        return ([...usersFromFriend, ...usersFromUser]);
    }

    async findPending(id: number)
    {
        const friensdAsking = await this.friendshipRepository
            .createQueryBuilder('friendships')
            .innerJoinAndSelect('friendships.user', 'user')
            .innerJoinAndSelect('friendships.friend', 'friend')
            .where(`friend.id = :id AND statu = 'pending'`, { id: id })
            .getMany();
        
        const usersAsking = friensdAsking.map((friendship) => ({
            id: friendship.user.id, 
            pseudo: friendship.user.pseudo, 
            profilPic: friendship.user.profilPic}));
        return (usersAsking);
    }

    async acceptFriendship(friend_id: number, user_id: number): Promise<Friendships> 
    {
        const friendship = await this.friendshipRepository.findOne({
          where: { user: { id: user_id }, friend: { id: friend_id } },
        });
    
        if (!friendship) {
          throw new Error('Friendship not found.');
        }
    
        friendship.statu = 'accepted';
        return this.friendshipRepository.save(friendship);
    }

    async deleteFriendship(friend_id: number, user_id: number)
    {
        let friendship = await this.friendshipRepository.findOne({
            where: { user: { id: user_id }, friend: { id: friend_id } },
            });
        if (!friendship)
        {
            friendship = await this.friendshipRepository.findOne({
                where: { user: { id: friend_id }, friend: { id: user_id } },
                });
        }
        if (!friendship)
            throw new Error('no such friendship.');
        const res = await this.friendshipRepository.delete(friendship.id);
        return (res);
    }
    async askFriend(friend_id: number, user_id: number)
    {
        let friendshipAllready = await this.friendshipRepository.findOne({
            where: { user: { id: user_id }, friend: { id: friend_id } },
            });
        let friendshipAllready2 = await this.friendshipRepository.findOne({
            where: { user: { id: friend_id }, friend: { id: user_id } },
            });
        let res;
        if (friendshipAllready)
        {
            friendshipAllready.statu = 'accepted';
            res = await this.friendshipRepository.save(friendshipAllready);
        }
        else if (friendshipAllready2)
        {
            friendshipAllready2.statu = 'accepted';
            res = await this.friendshipRepository.save(friendshipAllready2);
        }
        else
        {
            let friendship = {statu: 'pending', user: {id: user_id}, friend: {id: friend_id}};
            const newFriendship = await this.friendshipRepository.create(friendship);
            res = await this.friendshipRepository.save(newFriendship);
        }
        return (res);
    }
    async getFriendRelation(friend_id: number, user_id: number)
    {
        let friendship = await this.friendshipRepository.findOne({
            where: { user: { id: user_id }, friend: { id: friend_id } },
            });
        let friendship2 = await this.friendshipRepository.findOne({
            where: { user: { id: friend_id }, friend: { id: user_id } },
            });
        if (!friendship && !friendship2)
            throw new Error('no such friendship.');
        if (friendship)
            return (friendship.statu);
        if (friendship2)
            return (friendship2.statu);
    }
    async clearFriendship(user_id: number, friend_id: number)
    {
        let friendship = await this.friendshipRepository.findOne({
            where: { user: { id: user_id }, friend: { id: friend_id } },
            });
        let friendship2 = await this.friendshipRepository.findOne({
            where: { user: { id: friend_id }, friend: { id: user_id } },
            });
        if (friendship)
            return (await this.friendshipRepository.remove(friendship));
        if (friendship2)
            return (await this.friendshipRepository.remove(friendship2));
    }
}
