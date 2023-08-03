import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Messages } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @Inject('MESSAGE_REPOSITORY')
        private messageRepository: Repository<Messages>,
    ) {}
    /**
     * find all the messages from a channel
     * 
     * @param channelName name of channel
     * @returns result of the request
     */
    async findMessageFromChannel(channelName)
    {
        return this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.channel', 'channel')
        .leftJoinAndSelect('message.user', 'user')
        .where('channel.name = :name', { name: channelName })
        .getMany();
    }

    /**
     * create a new message
     * 
     * @param message The message to be created {user, channel, dateSent, content}
     * @returns the result of the request
     */
    async post(message: Partial<Messages>)
    {
        const newMessage = this.messageRepository.create(message);
        return (this.messageRepository.save(newMessage));
    }
}
