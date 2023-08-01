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
    }): Promise<"Error" | {
        response: import("./channel.entity").Channels;
        response2: import("../channels_users/channels_users.entity").ChannelsUsers;
    }>;
    join(body: any): Promise<void>;
    findAll(): Promise<import("./channel.entity").Channels[]>;
}
