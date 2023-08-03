import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
    constructor (private readonly messageService: MessageService) {}
    /**
     * 
     * @param channelname name of channel
     * @returns result of the request
     */
    @Get(':channelname')
    async find(@Param('channelname') channelname: string)
    {
        return this.messageService.findMessageFromChannel(channelname);
    }
    /**
     * create a new message
     * 
     * @param body the message to be post {user, channel, dateSent, content}
     * @returns the result of the request
     */
    @Post('create')
    async post(@Body() body)
    {
        return (await this.messageService.post(body));
        
    }
}
