import { ChannelService } from './channel.service';
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    callFunction(fct: any, body: any): Promise<any>;
    findAll(): Promise<import("./channel.entity").Channels[]>;
    createChannel(body: any): Promise<any>;
}
