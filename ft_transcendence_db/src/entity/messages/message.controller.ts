import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { BlockshipService } from '../blockships/blockship.service';
import { SessionService } from '../sessions/session.service';
import { Request } from 'express';

@Controller('messages')
export class MessageController {
    constructor (private readonly messageService: MessageService, private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService) {}

    @Get(':channelname')
    async find(@Param('channelname') channelname: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            return (null);
        const listUserBlocked = await this.blockshipService.findUserblockedFromId(user.id);
        let listUserBlockedId = [];
        for (let i = 0; i < listUserBlocked.length; i++)
        {
            listUserBlockedId.push(listUserBlocked[i].id);
        }
        const res = await this.messageService.findMessageFromChannel(channelname, listUserBlockedId, user.id);
        return (res);
    }
}
