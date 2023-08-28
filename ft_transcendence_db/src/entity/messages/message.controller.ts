import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { BlockshipService } from '../blockships/blockship.service';

@Controller('messages')
export class MessageController {
    constructor (private readonly messageService: MessageService, private readonly blockshipService: BlockshipService) {}
    /**
     * 
     * @param channelname name of channel
     * @param id id of user who mades the request
     * @returns result of the request
     */
    @Get(':channelname/:id')
    async find(@Param('channelname') channelname: string, @Param('id') user_id)
    {
        const listUserBlocked = await this.blockshipService.findUserblockedFromId(user_id);
        let listUserBlockedId = [];
        for (let i = 0; i < listUserBlocked.length; i++)
        {
            listUserBlockedId.push(listUserBlocked[i].id);
        }
        return this.messageService.findMessageFromChannel(channelname, listUserBlockedId);
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
