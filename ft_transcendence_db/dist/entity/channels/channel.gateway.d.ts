import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
export declare class ChannelGateway {
    private readonly channelService;
    private readonly channelsUsersService;
    private readonly sessionService;
    server: Server;
    constructor(channelService: ChannelService, channelsUsersService: ChannelsUsersService, sessionService: SessionService);
    create(data: any): Promise<"not connected" | "input error" | {
        response: {
            isADm: boolean;
            name: string;
            category: string;
            channel_id: number;
        };
        response2: import("../channels_users/channels_users.entity").ChannelsUsers;
    }>;
    createGoodInputs(channel: any, user: any): Boolean;
    join(body: any): Promise<string>;
}
