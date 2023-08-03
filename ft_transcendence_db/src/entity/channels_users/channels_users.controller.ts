import { Body, Controller, Post } from '@nestjs/common';
import { ChannelsUsersService } from './channels_users.service';

@Controller('channels_users')
export class ChannelsUsersController {
    constructor (private readonly channelsUsersService: ChannelsUsersService) {}
    /**
     * create a new channelsUsers relation
     * 
     * @param body ChannelsUsers to create {id, user, channel, isAdmin, isOwner, isInvited, isBanned}
     * @returns result of request
     */
    @Post('')
    async createNew(@Body() body)
    {
        return (await this.channelsUsersService.createNew(body))
    }
}
