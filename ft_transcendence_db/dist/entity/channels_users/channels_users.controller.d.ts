import { ChannelsUsersService } from './channels_users.service';
export declare class ChannelsUsersController {
    private readonly channelsUsersService;
    constructor(channelsUsersService: ChannelsUsersService);
    findAll(): Promise<import("./channels_users.entity").ChannelsUsers[]>;
    createNew(body: any): Promise<import("./channels_users.entity").ChannelsUsers>;
}
