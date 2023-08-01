import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
export declare class ChannelsUsersGateway {
    private readonly channelsUsersService;
    server: Server;
    constructor(channelsUsersService: ChannelsUsersService);
    findUsersOfChannel(body: any): Promise<void>;
}
