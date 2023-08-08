import { Repository } from 'typeorm';
import { Messages } from './message.entity';
export declare class MessageService {
    private messageRepository;
    constructor(messageRepository: Repository<Messages>);
    findMessageFromChannel(channelName: any): Promise<Messages[]>;
    post(message: Partial<Messages>): Promise<Messages>;
}
