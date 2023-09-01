import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { BlockshipService } from '../blockships/blockship.service';
import { SessionService } from '../sessions/session.service';

@Controller('messages')
export class MessageController {
    constructor (private readonly messageService: MessageService, private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService) {}
    /**
     * 
     * @param channelname name of channel
     * @param id id of user who mades the request
     * @returns result of the request
     */
    @Get(':channelname')
    async find(@Param('channelname') channelname: string, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const listUserBlocked = await this.blockshipService.findUserblockedFromId(user.id);
        let listUserBlockedId = [];
        for (let i = 0; i < listUserBlocked.length; i++)
        {
            listUserBlockedId.push(listUserBlocked[i].id);
        }
        const res = await this.messageService.findMessageFromChannel(channelname, listUserBlockedId);
        return (res);
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
