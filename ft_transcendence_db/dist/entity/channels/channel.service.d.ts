import { Repository } from 'typeorm';
import { Channels } from './channel.entity';
export declare class ChannelService {
    private channelRepository;
    constructor(channelRepository: Repository<Channels>);
    callFunction(fct: any, body: any): Promise<any>;
    findAll(): Promise<Channels[]>;
    findByName(channelName: any): Promise<Channels[]>;
    createChannel(channel: Partial<Channels>): Promise<Channels>;
}
