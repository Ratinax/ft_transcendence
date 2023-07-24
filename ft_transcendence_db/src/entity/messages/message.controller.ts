import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
    constructor (private readonly messageService: MessageService) {}
    @Get('')
    async findAll()
    {
        return (await this.messageService.findAll());
    }
    @Get(':channelname')
    async find(@Param('channelname') channelname: string)
    {
        return this.messageService.findMessageFromChannel(channelname);
    }
    callFunction(fct, body)
    {
        return (this.messageService.callFunction(fct.bind(this.messageService), body));
    }
    @Post('create')
    async post(@Body() body)
    {
        return (await this.callFunction(this.messageService.post, body));
        
    }
}
