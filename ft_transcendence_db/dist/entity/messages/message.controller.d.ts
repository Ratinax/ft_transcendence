import { MessageService } from './message.service';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    find(channelname: string): Promise<import("./message.entity").Messages[]>;
    post(body: any): Promise<import("./message.entity").Messages>;
}
