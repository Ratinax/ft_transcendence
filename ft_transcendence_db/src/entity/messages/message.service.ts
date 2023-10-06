import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Messages } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @Inject('MESSAGE_REPOSITORY')
        private messageRepository: Repository<Messages>,
    ) {}

    async findMessageFromChannel(channelName: string, listUserBlocked: Array<number>, user_id: number)
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
        const messages = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.channel', 'channel')
        .leftJoinAndSelect('message.user', 'user')
        .leftJoinAndSelect('message.game', 'game')
        .where(`channel.name = :name ${removeBlockString}`, { name: channelName })
        .getMany();
        const messagesMapped = messages.map((message) => ({
                id: message.id,
                user:
                {
                    pseudo: message.user.pseudo,
                },
                content: message.content,
                isAGameInvite: message.isAGameInvite,
                isSender: user_id === message.user.id,
                game: message.game,
            }));
        return (messagesMapped);
    }

    async post(message: Partial<Messages>)
    {
        try
        {

            const newMessage = this.messageRepository.create(message);
            const res =  await this.messageRepository.save(newMessage);
            return (res);
        }
        catch (e)
        {
            console.log('error :', e)
        }
    }
}
