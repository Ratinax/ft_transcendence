import { Repository } from 'typeorm';
import { Messages } from './message.entity';
export declare class MessageService {
    private messageRepository;
    constructor(messageRepository: Repository<Messages>);
    findMessageFromChannel(channelName: any, listUserBlocked: any, user_id: any): Promise<{
        id: number;
        user: {
            pseudo: string;
        };
        content: string;
        isAGameInvite: Boolean;
        isSender: boolean;
    }[]>;
    post(message: Partial<Messages>): Promise<Messages>;
}
