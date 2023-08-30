import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
export declare class ChannelController {
    private readonly channelService;
    private readonly channelsUsersService;
    private readonly sessionService;
    constructor(channelService: ChannelService, channelsUsersService: ChannelsUsersService, sessionService: SessionService);
    find(user_id: number, req: any): Promise<{
        channel_id: number;
        isADm: boolean;
        name: string;
        category: string;
    }[]>;
    setPassword(body: any, req: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    removePassword(body: any, req: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    changePassword(body: any, req: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
}
