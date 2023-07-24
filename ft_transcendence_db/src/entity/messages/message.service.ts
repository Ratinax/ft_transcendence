import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Messages } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @Inject('MESSAGE_REPOSITORY')
        private messageRepository: Repository<Messages>,
    ) {}
    async callFunction(fct, body)
    {
        let res;
        try
        {
            res = await fct(body);
            return (res);
        }
        catch (error)
        {
            return (false);
        }
    }
    async findAll(): Promise<Messages[]>
    {
        return this.messageRepository.find();
    }

    async findMessageFromChannel(channelName)
    {
        return this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.channel', 'channel')
        .leftJoinAndSelect('message.user', 'user')
        .where('channel.name = :name', { name: channelName })
        .getMany();
    }

    async post(message: Partial<Messages>)
    {
        const newMessage = this.messageRepository.create(message);
        return (this.messageRepository.save(newMessage));
    }
}
