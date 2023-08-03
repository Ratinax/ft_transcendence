import { Inject, Injectable } from '@nestjs/common';
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
        const newChannel = this.channelRepository.create(channel);
        return (this.channelRepository.save(newChannel));
    }
}