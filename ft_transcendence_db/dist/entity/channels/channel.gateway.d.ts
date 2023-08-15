import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
export declare class ChannelGateway {
    private readonly channelService;
    private readonly channelsUsersService;
    server: Server;
    constructor(channelService: ChannelService, channelsUsersService: ChannelsUsersService);
    create(data: {
        channel: any;
        user: any;
    }): Promise<"input error" | {
        response: {
            isADm: boolean;
            name: string;
            category: string;
            channel_id: number;
        };
        response2: import("../channels_users/channels_users.entity").ChannelsUsers;
    }>;
    createGoodInputs(channel: any, user: any): Boolean;
    join(body: any): Promise<void>;
}
