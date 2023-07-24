import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService) {}
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

    @Post('create')
    async createChannel(@Body() body)
    {
        return (await this.callFunction(this.channelService.createChannel, body));
    }
}
