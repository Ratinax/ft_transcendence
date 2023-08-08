import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
export declare class ChannelController {
    private readonly channelService;
    private readonly channelsUsersService;
    constructor(channelService: ChannelService, channelsUsersService: ChannelsUsersService);
    find(user_id: number): Promise<import("./channel.entity").Channels[]>;
    setPassword(body: any): Promise<import("./channel.entity").Channels>;
    removePassword(body: any): Promise<import("./channel.entity").Channels>;
    changePassword(body: any): Promise<import("./channel.entity").Channels>;
}
