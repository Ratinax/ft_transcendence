import { Channels } from "../channels/channel.entity";
import { Users } from "../users/user.entity";
export declare class ChannelsUsers {
    id: number;
    user: Users;
    channel: Channels;
    isAdmin: boolean;
    isOwner: boolean;
    isInvited: boolean;
    isBanned: boolean;
}
