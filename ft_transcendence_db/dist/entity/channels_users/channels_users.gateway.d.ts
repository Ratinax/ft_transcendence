import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';
export declare class ChannelsUsersGateway {
    private readonly channelsUsersService;
    private readonly sessionService;
    server: Server;
    constructor(channelsUsersService: ChannelsUsersService, sessionService: SessionService);
    findUsersOfChannel(body: any): Promise<string>;
    ban(body: any): Promise<import("./channels_users.entity").ChannelsUsers | "not connected">;
    kick(body: any): Promise<import("./channels_users.entity").ChannelsUsers[] | "not connected">;
    leaveChannel(body: any): Promise<import("./channels_users.entity").ChannelsUsers[] | "not connected">;
    setAdmin(body: any): Promise<import("./channels_users.entity").ChannelsUsers | "not connected">;
    removeAdmin(body: any): Promise<import("./channels_users.entity").ChannelsUsers | "not connected">;
    timeoutUser(body: any): Promise<string>;
}
