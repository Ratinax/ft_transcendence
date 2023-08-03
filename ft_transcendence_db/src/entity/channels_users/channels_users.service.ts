import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';

@Injectable()
export class ChannelsUsersService {
    constructor(
        @Inject('CHANNELSUSERS_REPOSITORY')
        private channelsUsersRepository: Repository<ChannelsUsers>,
    ) {}
    /**
     * create a new ChannelsUsers relation
     * 
     * @param channels_users {user, channel, isAdmin, isOwner, isInvited, isBanned}
     * @returns result of request
     */
    createNew(channels_users: Partial<ChannelsUsers>)
    {
        const newRelation = this.channelsUsersRepository.create(channels_users);
        return (this.channelsUsersRepository.save(newRelation));
    }
    /**
     * get list of users in a channel
     * 
     * @param channelName name of channel
     * @returns list of user in channel
     */
    async findUsersOfChannel(channelName: string)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :channelName AND is_invited = false AND is_banned = false', { channelName })
            .getMany();
        const users = usersAndChannels.map((channelsUsers) => ({
            id: channelsUsers.user.id, 
            pseudo: channelsUsers.user.pseudo, 
            password: channelsUsers.user.password, 
            profilPic: channelsUsers.user.profilPic, 
            isConnected: channelsUsers.user.isConnected, 
            isOwner: channelsUsers.isOwner,
            isAdmin: channelsUsers.isAdmin, 
            isInvited: channelsUsers.isInvited,
            isBanned: channelsUsers.isBanned}));
        return (users);
    }
    
    /**
     * get the relation according to parameters
     * 
     * @param user_id id of user
     * @param channel_id id of channel
     * @returns result of request
     */
    async findRelation(user_id: number, channel_id: number)
    {
        const relation = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .where('channel_id = :channel_id AND user_id = :user_id', { channel_id: channel_id, user_id: user_id })
            .getMany();
        return (relation);
    }
    /**
     * Get the list of channels of a user
     * 
     * @param user_id id of user
     * @returns result of request
     */
    async findChannelsOfUsers(user_id: number)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('user.id = :user_id AND is_invited = false AND is_banned = false', { user_id })
            .getMany();
        const channels = usersAndChannels.map((channelsUsers) => (
            channelsUsers.channel
        ));
        return (channels);
    }
    /**
     * Modify the relation to set isBanned to true if exists
     * 
     * @param channel channel from which user is banned
     * @param userBanned the user banned
     * @returns {Object | null} the relation modified
     */
    async ban(channel, userBanned)
    {
        const relation = await this.findRelation(userBanned.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        const relationModified = this.channelsUsersRepository.create({
            id: relation[0].id,
            channel: channel,
            user: {
                id: userBanned.id,
            },
            isAdmin: false,
            isOwner: false,
            isInvited: false,
            isBanned: true,
        });
        return (this.channelsUsersRepository.save(relationModified));
    }
    /**
     * remove relation
     * 
     * @param channel channel to kick user from
     * @param userBanned user banned
     * @returns result of request
     */
    async kick(channel, userBanned)
    {
        const relation = await this.findRelation(userBanned.id, channel.channel_id);
        if (relation)
            return (await this.channelsUsersRepository.remove(relation));
    }
}
