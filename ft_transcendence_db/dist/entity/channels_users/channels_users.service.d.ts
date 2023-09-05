import { Repository } from 'typeorm';
import { ChannelsUsers } from './channels_users.entity';
export declare class ChannelsUsersService {
    private channelsUsersRepository;
    constructor(channelsUsersRepository: Repository<ChannelsUsers>);
    createNew(channels_users: Partial<ChannelsUsers>): Promise<ChannelsUsers>;
    findUsersOfChannel(channelName: string): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
        isOwner: boolean;
        isAdmin: boolean;
        isInvited: boolean;
        isBanned: boolean;
        dateTimeout: Date;
        durationTimeout: Number;
    }[]>;
    findRelation(user_id: number, channel_id: number): Promise<ChannelsUsers[]>;
    findChannelsOfUsers(user_id: number): Promise<{
        channel_id: number;
        isADm: boolean;
        name: string;
        category: string;
    }[]>;
    ban(channel: any, user: any): Promise<ChannelsUsers>;
    leave(channel: any, user: any): Promise<ChannelsUsers[]>;
    setAdmin(channel: any, user: any): Promise<ChannelsUsers>;
    removeAdmin(channel: any, user: any): Promise<ChannelsUsers>;
    getCurrentDate(): string;
    timeoutUser(channel: any, user: any, duration: any): Promise<ChannelsUsers>;
}
