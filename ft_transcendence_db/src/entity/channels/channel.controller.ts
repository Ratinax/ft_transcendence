import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';


@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService) {}
    /**
     * get channel list of a user
     * 
     * @param user_id id of user
     * @returns result of request
     */
    @Get(':id')
    async find(@Param('id') user_id : number)
    {
        const channels = await this.channelsUsersService.findChannelsOfUsers(user_id);
        return (channels);
    }

    /**
     * create a new channel
     * 
     * @param body channel to be created {channel_id, password, isADm, name, category}
     * @returns result of request
     */
    @Post('create')
    async createChannel(@Body() body)
    {
        return (await this.channelService.createChannel(body));
    }
}
