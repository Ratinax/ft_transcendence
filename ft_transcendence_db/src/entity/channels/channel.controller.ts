import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';


@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService) {}
    callFunction(fct, body)
    {
        return (this.channelService.callFunction(fct.bind(this.channelService), body));
    }
    @Get('')
    async findAll()
    {
        const channels = await this.channelService.findAll();
        return (channels);
    }
    @Get(':id')
    async find(@Param('id') user_id : number)
    {
        const channels = await this.channelsUsersService.findChannelsOfUsers(user_id);
        return (channels);
    }

    @Post('create')
    async createChannel(@Body() body)
    {
        return (await this.callFunction(this.channelService.createChannel, body));
    }
}
