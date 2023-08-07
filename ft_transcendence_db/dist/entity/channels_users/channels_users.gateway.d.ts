import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
export declare class ChannelsUsersGateway {
    private readonly channelsUsersService;
    server: Server;
    constructor(channelsUsersService: ChannelsUsersService);
    findUsersOfChannel(body: any): Promise<void>;
    ban(body: any): Promise<import("./channels_users.entity").ChannelsUsers>;
    kick(body: any): Promise<import("./channels_users.entity").ChannelsUsers[]>;
    leaveChannel(body: any): Promise<import("./channels_users.entity").ChannelsUsers[]>;
    setAdmin(body: any): Promise<import("./channels_users.entity").ChannelsUsers>;
    removeAdmin(body: any): Promise<import("./channels_users.entity").ChannelsUsers>;
}
