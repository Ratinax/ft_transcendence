import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';

@Injectable()
export class ChannelsUsersService {
    constructor(
        @Inject('CHANNELSUSERS_REPOSITORY')
        private channelsUsersRepository: Repository<ChannelsUsers>,
    ) {}

    async createNew(channels_users: Partial<ChannelsUsers>)
    {
        const relation = (await this.findRelation(channels_users.user.id, channels_users.channel.channel_id))[0];
        if (relation)
            return (false);
        const newRelation = this.channelsUsersRepository.create(channels_users);
        return (this.channelsUsersRepository.save(newRelation));
    }

    async findUsersOfChannel(channelName: string)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :channelName AND is_banned = false', { channelName })
            .getMany();
        const users = usersAndChannels.map((channelsUsers) => ({
            id: channelsUsers.user.id, 
            pseudo: channelsUsers.user.pseudo, 
            profilPic: channelsUsers.user.profilPic, 
            isOwner: channelsUsers.isOwner,
            isAdmin: channelsUsers.isAdmin, 
            isBanned: channelsUsers.isBanned,
            dateTimeout: channelsUsers.dateTimeout,
            durationTimeout: channelsUsers.durationTimeout,
            }));
        return (users);
    }
    
    async findRelation(user_id: number, channel_id: number)
    {
        const relation = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.channel_id = :channel_id AND user_id = :user_id', { channel_id: channel_id, user_id: user_id })
            .getMany();
        return (relation);
    }
    async findRelationByCName(user_id: number, name: string)
    {
        const relation = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :name AND user_id = :user_id', { name: name, user_id: user_id })
            .getMany();
        return (relation);
    }

    async findChannelsOfUsers(user_id: number)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('user.id = :user_id AND  is_banned = false', { user_id })
            .getMany();
        const channels = usersAndChannels.map((channelsUsers) => (
            {
                channel_id: channelsUsers.channel.channel_id,
                isADm: channelsUsers.channel.isADm,
                name: channelsUsers.channel.name,
                category: channelsUsers.channel.category,
                isHide: channelsUsers.isHide,
            }
        ));
        return (channels);
    }
    
    async ban(channel: {channel_id: number}, user: {id: number})
    {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        relation[0].isBanned = true;
        return (this.channelsUsersRepository.save(relation[0]));
    }

    async leave(channel: {channel_id: number}, user: {id: number})
    {
        const relation = (await this.findRelation(user.id, channel.channel_id))[0];
        let res;
        if (relation && !relation.channel.isADm)
            res = await this.channelsUsersRepository.remove(relation);
        else if (relation)
        {
            relation.isHide = true;
            res = await this.channelsUsersRepository.save(relation);
        }
        else if (!relation)
        {
            return (null);
        }
        const channels = await this.findUsersOfChannel(relation.channel.name);
        if (channels.length === 0)
            return ('Empty');
        return (res);

    }

    async setAdmin(channel: {channel_id: number}, user: {id: number})
    {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        relation[0].isAdmin = true;
        return (this.channelsUsersRepository.save(relation[0]));
    }

    async removeAdmin(channel: {channel_id: number}, user: {id: number})
    {
        const relation = await this.findRelation(user.id, channel.channel_id);
        if (!relation || !relation[0])
            return (null);
        relation[0].isAdmin = false;
        return (this.channelsUsersRepository.save(relation[0]));
    }

    getCurrentDate()
    {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    }

    async timeoutUser(channel: {channel_id: number}, user: {id: number}, duration: number)
    {
        const relation = await this.channelsUsersRepository.findOne({where :{
            user: {
                id: user.id,
            },
            channel: {
                channel_id: channel.channel_id,
            }
            }});
        if (!relation)
            return (null);
        relation.dateTimeout = new Date(this.getCurrentDate());
        relation.durationTimeout = duration;
        return (this.channelsUsersRepository.save(relation));
    }
    async unHide(user_id: number, channel_id: number)
    {
        const relation = (await this.findRelation(user_id, channel_id))[0];
        if (!relation)
            return (null);
        relation.isHide = false;
        return (await this.channelsUsersRepository.save(relation));
    }

    async findBannedUsers(channel_id: number)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.channel_id = :channel_id AND is_banned = true', { channel_id })
            .getMany();
        const users = usersAndChannels.map((channelsUsers) => ({
            id: channelsUsers.user.id, 
            pseudo: channelsUsers.user.pseudo, 
            profilPic: channelsUsers.user.is42User ? channelsUsers.user.profilPic : `http://${process.env.IP_ADDRESS}:3000/users/images/${channelsUsers.user.profilPic}`,
            isBanned: channelsUsers.isBanned,
            }));
        return (users);
    }
    async unBan(channel: {channel_id: number}, user: {id: number})
    {
        const relation = (await this.findRelation(user.id, channel.channel_id))[0];
        if (!relation)
            return (null);
        return (await this.channelsUsersRepository.remove(relation));
    }
    async cleanChan(channelName: string)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :channel_name', { channel_name: channelName })
            .getMany();
        for (let i = 0; i < usersAndChannels.length; i++)
        {
            await this.channelsUsersRepository.remove(usersAndChannels[i]);
        }
        return (true);
    }
    async getIsUserOwner(channel_id: number, user_id: number)
    {
        const relation = (await this.findRelation(user_id, channel_id))[0];
        if (relation)
            return (relation.isOwner);
        return (false);
    }
}
