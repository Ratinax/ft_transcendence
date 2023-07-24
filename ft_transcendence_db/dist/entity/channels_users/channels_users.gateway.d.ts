import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
import { Channels } from '../channels/channel.entity';
export declare class ChannelsUsersGateway {
    private readonly channelsUsersService;
    server: Server;
    constructor(channelsUsersService: ChannelsUsersService);
    findUsersOfChannel(channel: Channels): Promise<void>;
}
