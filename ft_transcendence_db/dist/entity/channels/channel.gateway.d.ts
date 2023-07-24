import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { Channels } from './channel.entity';
export declare class ChannelGateway {
    private readonly channelService;
    server: Server;
    constructor(channelService: ChannelService);
    create(channel: Channels): Promise<Channels | "Error">;
    findAll(): Promise<Channels[]>;
}
