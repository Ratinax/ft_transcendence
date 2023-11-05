import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
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
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
			throw new UnauthorizedException('Ressource not found');
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
