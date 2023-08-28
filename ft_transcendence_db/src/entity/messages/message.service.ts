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
     * @param listUserBlocked list of user blocked by user making request
     * @returns result of the request
     */
    async findMessageFromChannel(channelName, listUserBlocked)
    {
        let removeBlockString = '';
        if (listUserBlocked.length > 0)
        {
            removeBlockString = 'AND user_id not in (';
            for (let i = 0; i < listUserBlocked.length; i++)
            {
                removeBlockString += listUserBlocked[i];
                if (i + 1 < listUserBlocked.length)
                    removeBlockString += ', ';
            }
            removeBlockString += ')';
        }

        return this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.channel', 'channel')
        .leftJoinAndSelect('message.user', 'user')
        .where(`channel.name = :name ${removeBlockString}`, { name: channelName })
        .getMany();
    }

    /**
     * create a new message
     * 
     * @param message - {user, channel, dateSent, content, isAGameInvite}
     * @returns the result of the request
     */
    async post(message: Partial<Messages>)
    {
        const newMessage = this.messageRepository.create(message);
        return (this.messageRepository.save(newMessage));
    }
}
