import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Channels } from './channel.entity';

@Injectable()
export class ChannelService {
    constructor(
        @Inject('CHANNEL_REPOSITORY')
        private channelRepository: Repository<Channels>,
    ) {}
    /**
     * find channel by name
     * 
     * @param channelName channel name
     * @returns result of request
     */
    async findByName(channelName): Promise<Channels[]>
    {
        return this.channelRepository
        .createQueryBuilder('channel')
        .where('channel.name = :name', { name: channelName })
        .getMany();
    }

    /**
     * create channel
     * 
     * @param channel {channel_id, password, isADm, name, category}
     * @returns result of request
     */
    async createChannel(channel: Partial<Channels>)
    {
        const channelAllreadyExisting = await this.channelRepository.findOne({where: {name: channel.name}});
        if (channelAllreadyExisting)
        {
            console.log(channelAllreadyExisting)
            throw new InternalServerErrorException('channel allready exists');
        }
        const newChannel = this.channelRepository.create(channel);
        return (this.channelRepository.save(newChannel));
    }
    /**
     * set password to channel and Protected by password as category
     * 
     * @param channel channel
     * @param password password
     * @returns result of request
     */
    async setPassword(channel, password: string)
    {
        const relation = await this.channelRepository.findOne({where: {channel_id: channel.channel_id}});

        relation.category = 'Protected by password';
        relation.password = password; // TODO hash password
        return (this.channelRepository.save(relation));
    }
}