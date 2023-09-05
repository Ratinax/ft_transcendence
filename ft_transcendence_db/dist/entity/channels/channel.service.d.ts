import { Repository } from 'typeorm';
import { Channels } from './channel.entity';
export declare class ChannelService {
    private channelRepository;
    constructor(channelRepository: Repository<Channels>);
    findByName(channelName: any): Promise<Channels[]>;
    createChannel(channel: Partial<Channels>): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    setPassword(channel: any, password: string): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    removePassword(channel: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    changePassword(channel: any, password: string): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    toPublic(channel: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    toPrivate(channel: any): Promise<{
        isADm: boolean;
        name: string;
        category: string;
        channel_id: number;
    }>;
    comparePasswords(channel: any, password: string): Promise<any>;
    hashedPassword(password: string): Promise<any>;
}
