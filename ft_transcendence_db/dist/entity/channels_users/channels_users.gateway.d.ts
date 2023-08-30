import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';
export declare class ChannelsUsersGateway {
    private readonly channelsUsersService;
    private readonly sessionService;
    server: Server;
    constructor(channelsUsersService: ChannelsUsersService, sessionService: SessionService);
    findUsersOfChannel(body: any): Promise<string>;
    ban(body: any): Promise<"not connected" | import("./channels_users.entity").ChannelsUsers>;
    kick(body: any): Promise<"not connected" | import("./channels_users.entity").ChannelsUsers[]>;
    leaveChannel(body: any): Promise<"not connected" | import("./channels_users.entity").ChannelsUsers[]>;
    setAdmin(body: any): Promise<"not connected" | import("./channels_users.entity").ChannelsUsers>;
    removeAdmin(body: any): Promise<"not connected" | import("./channels_users.entity").ChannelsUsers>;
    timeoutUser(body: any): Promise<string>;
}
