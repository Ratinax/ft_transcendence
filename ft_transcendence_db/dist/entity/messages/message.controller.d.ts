import { MessageService } from './message.service';
import { BlockshipService } from '../blockships/blockship.service';
export declare class MessageController {
    private readonly messageService;
    private readonly blockshipService;
    constructor(messageService: MessageService, blockshipService: BlockshipService);
    find(channelname: string, user_id: any): Promise<import("./message.entity").Messages[]>;
    post(body: any): Promise<import("./message.entity").Messages>;
}
