import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';

@Injectable()
export class ChannelsUsersService {
    constructor(
        @Inject('CHANNELSUSERS_REPOSITORY')
        private channelsUsersRepository: Repository<ChannelsUsers>,
    ) {}
    async findAll(): Promise<ChannelsUsers[]>
    {
        return this.channelsUsersRepository.find();
    }
    async findUsersOfChannel(channelName: string)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('channel.name = :channelName', { channelName })
            .getMany();
        const users = usersAndChannels.map((channelsUsers) => ({
            id: channelsUsers.user.id, 
            pseudo: channelsUsers.user.pseudo, 
            password: channelsUsers.user.password, 
            profilPic: channelsUsers.user.profilPic, 
            isConnected: channelsUsers.user.isConnected, 
            isOwner: channelsUsers.isOwner,
            isAdmin: channelsUsers.isAdmin, 
            isInvited: channelsUsers.isInvited}));
        // console.log(users)
        return (users);
    }
    createNew(channels_users: Partial<ChannelsUsers>)
    {
        const newRelation = this.channelsUsersRepository.create(channels_users);
        return (this.channelsUsersRepository.save(newRelation));
    }
    async findRelation(user_id: number, channel_id: number)
    {
        console.log('les u id :', user_id, channel_id);
        const relation = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .where('channel_id = :channel_id AND user_id = :user_id', { channel_id: channel_id, user_id: user_id })
            .getMany();
        console.log('la relation :', relation)
        return (relation);
    }
    async findChannelsOfUsers(user_id: number)
    {
        const usersAndChannels = await this.channelsUsersRepository
            .createQueryBuilder('channelsUsers')
            .innerJoinAndSelect('channelsUsers.user', 'user')
            .innerJoinAndSelect('channelsUsers.channel', 'channel')
            .where('user.id = :user_id AND is_invited = false', { user_id })
            .getMany();
        const channels = usersAndChannels.map((channelsUsers) => (
            channelsUsers.channel
        ));
        return (channels);
    }
}
