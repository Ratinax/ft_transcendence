import { Repository } from 'typeorm';
import { Channels } from './channel.entity';
export declare class ChannelService {
    private channelRepository;
    constructor(channelRepository: Repository<Channels>);
    findByName(channelName: any): Promise<Channels[]>;
    createChannel(channel: Partial<Channels>): Promise<Channels>;
}
