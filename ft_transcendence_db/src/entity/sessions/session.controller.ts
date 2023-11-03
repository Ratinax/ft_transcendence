import { BadRequestException, Controller, Get, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request, Response } from 'express';
import { FriendshipService } from '../friendships/friendship.service';
import { UserService } from '../users/user.service';

@Controller('sessions')
export class SessionController {
    constructor (private readonly sessionService: SessionService, private readonly friendshipService: FriendshipService, private readonly userService: UserService) {}
    @Post('pingBack')
    async pingBack(@Req() req: Request, @Res({passthrough: true}) res: Response)
    {
        if (!req.cookies['SESSION_KEY'])
        {
            return (null);
        }
        const sessionCookie = await this.sessionService.refreshSessionKey(req.cookies['SESSION_KEY']);
        if (!sessionCookie)
            throw new BadRequestException('Ressource not found');
        res.cookie('SESSION_KEY', sessionCookie.sessionKey, {httpOnly: true, expires: new Date(sessionCookie.expirationDate)});
    }
    @Get('cookies')
    getCookies(@Req() req: Request)
    {
        return (req.cookies['SESSION_KEY']);
    }
    @Get('isConnected/:pseudo')
    async getIsConnected(@Req() req: Request, @Param('pseudo') pseudo: string)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data');
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(pseudo))[0];
        const resFriend = await this.friendshipService.getFriendRelation(friend.id, user.id);
        if (!resFriend || resFriend !== 'accepted')
        	throw new UnauthorizedException('You are not able to access this data');
        const res = !(await this.sessionService.getIsPseudoExpired(pseudo));
        return (res);
    }
}
