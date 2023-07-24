import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChannelsUsersService } from './channels_users.service';

@Controller('channels_users')
export class ChannelsUsersController {
    constructor (private readonly channelsUsersService: ChannelsUsersService) {}
    @Get('')
    async findAll()
    {
        return (await this.channelsUsersService.findAll());
    }
    @Post('')
    async createNew(@Body() body)
    {
        return (await this.channelsUsersService.createNew(body))
    }
}
