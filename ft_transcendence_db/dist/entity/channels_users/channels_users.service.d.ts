import { Repository } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';
export declare class ChannelsUsersService {
    private channelsUsersRepository;
    constructor(channelsUsersRepository: Repository<ChannelsUsers>);
    findAll(): Promise<ChannelsUsers[]>;
    findUsersOfChannel(channelName: string): Promise<{
        id: number;
        pseudo: string;
        password: string;
        profilPic: string;
        isConnected: boolean;
        isOwner: boolean;
        isAdmin: boolean;
        isInvited: boolean;
    }[]>;
    createNew(channels_users: Partial<ChannelsUsers>): Promise<ChannelsUsers>;
    findRelation(user_id: number, channel_id: number): Promise<ChannelsUsers[]>;
    findChannelsOfUsers(user_id: number): Promise<import("../channels/channel.entity").Channels[]>;
}
