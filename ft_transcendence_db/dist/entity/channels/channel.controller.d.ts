import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
export declare class ChannelController {
    private readonly channelService;
    private readonly channelsUsersService;
    constructor(channelService: ChannelService, channelsUsersService: ChannelsUsersService);
    find(user_id: number): Promise<{
        channel_id: number;
        isADm: boolean;
        name: string;
        category: string;
    }[]>;
    setPassword(body: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    removePassword(body: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    changePassword(body: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
}
