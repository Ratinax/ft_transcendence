import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
export declare class ChannelController {
    private readonly channelService;
    private readonly channelsUsersService;
    constructor(channelService: ChannelService, channelsUsersService: ChannelsUsersService);
    callFunction(fct: any, body: any): Promise<any>;
    findAll(): Promise<import("./channel.entity").Channels[]>;
    find(user_id: number): Promise<import("./channel.entity").Channels[]>;
    createChannel(body: any): Promise<any>;
}
