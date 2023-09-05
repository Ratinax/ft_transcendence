import { Users } from "../users/user.entity";
import { Channels } from "../channels/channel.entity";
export declare class Messages {
    id: number;
    user: Partial<Users>;
    channel: Channels;
    dateSent: Date;
    content: string;
    isAGameInvite: Boolean;
}
