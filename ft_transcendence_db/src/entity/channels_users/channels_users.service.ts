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
}
