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

    async findByName(channelName)
    {
        return await this.channelRepository
        .createQueryBuilder('channel')
        .where('channel.name = :name', { name: channelName })
        .getMany();
    }

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
        relation.password = '';
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
        relation.password = '';

        const res = await this.channelRepository.save(relation);
        return ({isADm: res.isADm,
            name: res.name,
            category: res.category,
            channel_id: res.channel_id,});
    }
    async removeChan(channel_id: number)
    {
        const relation = await this.channelRepository.findOne({where: {channel_id: channel_id}});

        const res = await this.channelRepository.remove(relation);
        return (res);
    }
    async comparePasswords(channel, password: string)
    {
        return (await bcrypt.compare(password + process.env.PEPPER, channel.password));
    }
    async hashedPassword(password: string)
    {
        return (await bcrypt.hash(password + process.env.PEPPER, +process.env.SALTROUNDS))
    }
}