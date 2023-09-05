import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
export declare class MessagesGateway {
    private readonly messagesService;
    private readonly channelsUsersService;
    private readonly sessionService;
    server: Server;
    constructor(messagesService: MessageService, channelsUsersService: ChannelsUsersService, sessionService: SessionService);
    create(body: any): Promise<import("./message.entity").Messages | "not connected" | "user timeout">;
}
