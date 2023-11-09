import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import { FriendshipService } from '../friendships/friendship.service';
import { UserService } from '../users/user.service';

@Controller('sessions')
export class SessionController {
    constructor (private readonly sessionService: SessionService, private readonly friendshipService: FriendshipService, private readonly userService: UserService) {}
    @Get('cookies')
    async getCookies(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
            return ('');
        return (req.cookies['SESSION_KEY']);
    }
    @Get('isConnected/:pseudo')
    async getIsConnected(@Req() req: Request, @Param('pseudo') pseudo: string)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data');
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(pseudo));
        if (!friend)
        	throw new UnauthorizedException('You are not able to access this data');
        const resFriend = await this.friendshipService.getFriendRelation(friend.id, user.id);
        if (!resFriend || resFriend !== 'accepted')
        	throw new UnauthorizedException('You are not able to access this data');
        const res = this.sessionService.getIsConnected(pseudo);
        return (res);
    }
}
