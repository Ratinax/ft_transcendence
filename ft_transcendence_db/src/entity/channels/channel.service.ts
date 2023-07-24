import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Channels } from './channel.entity';

@Injectable()
export class ChannelService {
    constructor(
        @Inject('CHANNEL_REPOSITORY')
        private channelRepository: Repository<Channels>,
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
    async findAll(): Promise<Channels[]>
    {
        return this.channelRepository.find();
    }
    async findByName(channelName): Promise<Channels[]>
    {
        return this.channelRepository
        .createQueryBuilder('channel')
        .where('channel.name = :name', { name: channelName })
        .getMany();
    }

    async createChannel(channel: Partial<Channels>)
    {
        const newChannel = this.channelRepository.create(channel);
        return (this.channelRepository.save(newChannel));
    }
}