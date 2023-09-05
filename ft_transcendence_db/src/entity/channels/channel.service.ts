import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Channels } from './channel.entity';
import * as bcrypt from 'bcrypt';


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
     * @param channel - {channel_id, password, isADm, name, category}
     * @returns result of request
     */
    async createChannel(channel: Partial<Channels>)
    {
        const channelAllreadyExisting = await this.channelRepository.findOne({where: {name: channel.name}});
        if (channelAllreadyExisting)
        {
            throw new InternalServerErrorException('channel allready exists');
        }
        const passwordHashed = await this.hashedPassword(channel.password);
        const finalChannel = {...channel, password: passwordHashed};
        const newChannel = this.channelRepository.create(finalChannel);
        const res = await this.channelRepository.save(newChannel);
        return ({
            isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,
        });
    }
    /**
     * set password to channel and Protected by password as category
     * 
     * @param channel channel
     * @param password password
     * @returns result of request
     * @throws InternalServerErrorException('Password not good length')
     */
    async setPassword(channel, password: string)
    {
        if (password.length > 20 || password.length < 3)
            throw new InternalServerErrorException('Password not good length');
        const relation = await this.channelRepository.findOne({where: {channel_id: channel.channel_id}});
        const passwordHashed = await this.hashedPassword(password);

        relation.category = 'Protected by password';
        relation.password = passwordHashed;
        const res = await this.channelRepository.save(relation);
        return ({
                isADm: res.isADm,
                name: res.name,
                category: res.category,
                channel_id: res.channel_id,
            });
    }

    /**
     * remove password to channel and set Public to category
     * 
     * @param channel channel
     * @returns result of request
     */
    async removePassword(channel)
    {
        const relation = await this.channelRepository.findOne({where: {channel_id: channel.channel_id}});

        relation.category = 'Public';
        relation.password = '';
        const res = await this.channelRepository.save(relation);
        return ({isADm: res.isADm,
                name: res.name,
                category: res.category,
                channel_id: res.channel_id,});
    }

    /**
     * change password of a channel
     * 
     * @param channel channel
     * @param password password
     * @returns result of request
     * @throws InternalServerErrorException('Password not good length')
     */
    async changePassword(channel, password: string)
    {
        if (password.length > 20 || password.length < 3)
            throw new InternalServerErrorException('Password not good length');
        const relation = await this.channelRepository.findOne({where: {channel_id: channel.channel_id}});
        const passwordHashed = await this.hashedPassword(password);

        relation.category = 'Protected by password';
        relation.password = passwordHashed;
        const res = await this.channelRepository.save(relation);
        return ({isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,});
    }
    async toPublic(channel)
    {
        const relation = await this.channelRepository.findOne({where: {channel_id: channel.channel_id}});

        relation.category = 'Public';
        const res = await this.channelRepository.save(relation);
        return ({isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,});
    }
    async toPrivate(channel)
    {
        const relation = await this.channelRepository.findOne({where: {channel_id: channel.channel_id}});

        relation.category = 'Private';
        const res = await this.channelRepository.save(relation);
        return ({isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,});
    }
    /**
     * compare password given with password hashed of channel
     * 
     * @param channel channel to compare password with
     * @param password password to be compared
     * @returns true | false
     */
    async comparePasswords(channel, password: string)
    {
        return (await bcrypt.compare(password + process.env.PEPPER, channel.password));
    }
    /**
     * 
     * @param password password to be hashed
     * @returns the hashed version of password
     */
    async hashedPassword(password: string)
    {
        return (await bcrypt.hash(password + process.env.PEPPER, +process.env.SALTROUNDS))
    }
}