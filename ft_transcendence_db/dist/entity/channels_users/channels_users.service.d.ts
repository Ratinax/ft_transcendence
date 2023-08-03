import { Repository } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';
export declare class ChannelsUsersService {
    private channelsUsersRepository;
    constructor(channelsUsersRepository: Repository<ChannelsUsers>);
    createNew(channels_users: Partial<ChannelsUsers>): Promise<ChannelsUsers>;
    findUsersOfChannel(channelName: string): Promise<{
        id: number;
        pseudo: string;
        password: string;
        profilPic: string;
        isConnected: boolean;
        isOwner: boolean;
        isAdmin: boolean;
        isInvited: boolean;
        isBanned: boolean;
    }[]>;
    findRelation(user_id: number, channel_id: number): Promise<ChannelsUsers[]>;
    findChannelsOfUsers(user_id: number): Promise<import("../channels/channel.entity").Channels[]>;
    ban(channel: any, userBanned: any): Promise<ChannelsUsers>;
    kick(channel: any, userBanned: any): Promise<ChannelsUsers[]>;
}
