import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService, private readonly sessionService: SessionService, private readonly userService: UserService) {}

    @Get('friendsof/')
    async findFriendOfId(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            return (null);
        return (await this.friendshipService.findFriendOfId(user.id));
    }

    @Get('pending/')
    async findPending(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            return (null);
        return (await this.friendshipService.findPending(user.id));
    }
    @Post('ask')
    async askFriend(@Req() req: Request, @Body() body: {pseudo: string})
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(body.pseudo))[0];
        try
        {
            const res = await this.friendshipService.askFriend(friend.id, user.id);
            return ('pending')
        }
        catch (e)
        {
            return (null);
        }
    }
    @Post('remove')
    async removeFriend(@Req() req: Request, @Body() body: {pseudo: string})
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(body.pseudo))[0];
        try
        {
            const res = await this.friendshipService.deleteFriendship(friend.id, user.id);
            return ('')
        }
        catch (e)
        {
            return ('');
        }
    }
    @Get('friendRelation/:pseudoFriend')
    async isFriend(@Param('pseudoFriend') pseudoFriend: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(pseudoFriend))[0];
        try
        {
            const res = await this.friendshipService.getFriendRelation(friend.id, user.id);
            return (res);
        }
        catch (e)
        {
            return ('');
        }
    }
}
