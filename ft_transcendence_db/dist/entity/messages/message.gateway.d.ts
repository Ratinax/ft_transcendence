import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { Messages } from './message.entity';
export declare class MessagesGateway {
    private readonly messagesService;
    server: Server;
    constructor(messagesService: MessageService);
    create(message: Messages): Promise<Messages>;
    findAll(): Promise<Messages[]>;
}
