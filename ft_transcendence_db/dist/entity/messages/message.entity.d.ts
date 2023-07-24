import { Users } from "../users/user.entity";
import { Channels } from "../channels/channel.entity";
export declare class Messages {
    id: number;
    user: Users;
    channel: Channels;
    dateSent: Date;
    content: string;
}
