import { MessageService } from './message.service';
import { BlockshipService } from '../blockships/blockship.service';
import { SessionService } from '../sessions/session.service';
export declare class MessageController {
    private readonly messageService;
    private readonly blockshipService;
    private readonly sessionService;
    constructor(messageService: MessageService, blockshipService: BlockshipService, sessionService: SessionService);
    find(channelname: string, req: any): Promise<import("./message.entity").Messages[]>;
    post(body: any): Promise<import("./message.entity").Messages>;
}
