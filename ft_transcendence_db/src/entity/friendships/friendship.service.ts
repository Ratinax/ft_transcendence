import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Friendships } from './friendship.entity';

@Injectable()
export class FriendshipService {
    constructor(
        @Inject('FRIENDSHIP_REPOSITORY')
        private friendshipRepository: Repository<Friendships>,
    ) {}
    /**
     * get the friend list of the user
     * 
     * @param id id of user
     * @returns the friend list of the user
     */
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
    /**
     * Get the firend request that a user received
     * 
     * @param id id of user
     * @returns the friend requests of the user
     */
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
    /**
     * accept a friendship request
     * 
     * @param friend_id id of user accepting the friendship request
     * @param user_id id of user that sent the request
     * @returns result of the request
     * @throws Error('Friendship not found.')
     */
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
    /**
     * remove a friendship (that can be either accepted or pending)
     * 
     * @param friend_id id of one of the friends
     * @param user_id id of one of the friends
     * @returns result of request
     * @throws Error('no such friendship.')
     */
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
}