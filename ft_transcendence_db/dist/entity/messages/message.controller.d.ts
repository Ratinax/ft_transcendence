import { MessageService } from './message.service';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    findAll(): Promise<import("./message.entity").Messages[]>;
    find(channelname: string): Promise<import("./message.entity").Messages[]>;
    callFunction(fct: any, body: any): Promise<any>;
    post(body: any): Promise<any>;
}
