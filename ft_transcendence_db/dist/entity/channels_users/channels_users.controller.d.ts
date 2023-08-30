import { ChannelsUsersService } from './channels_users.service';
import { SessionService } from '../sessions/session.service';
export declare class ChannelsUsersController {
    private readonly channelsUsersService;
    private readonly sessionService;
    constructor(channelsUsersService: ChannelsUsersService, sessionService: SessionService);
    getUserWithPermissions(req: any, channelId: any): Promise<{
        id: number;
        isAdmin: boolean;
        isOwner: boolean;
        isInvited: boolean;
        isBanned: boolean;
    }>;
}
