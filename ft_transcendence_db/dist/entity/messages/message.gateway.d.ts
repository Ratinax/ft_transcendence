import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
export declare class MessagesGateway {
    private readonly messagesService;
    private readonly channelsUsersService;
    server: Server;
    constructor(messagesService: MessageService, channelsUsersService: ChannelsUsersService);
    create(body: any): Promise<import("./message.entity").Messages | "user timeout">;
}
