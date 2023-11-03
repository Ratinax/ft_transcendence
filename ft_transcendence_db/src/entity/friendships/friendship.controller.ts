import { BadRequestException, Body, Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';
import { BlockshipService } from '../blockships/blockship.service';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService, private readonly sessionService: SessionService, private readonly userService: UserService, private readonly blockshipService: BlockshipService) {}

    @Get('friendsof/')
    async findFriendOfId(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException('Ressource not found');
        return (await this.friendshipService.findFriendOfId(user.id));
    }

    @Get('pending/')
    async findPending(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException('Ressource not found');
        return (await this.friendshipService.findPending(user.id));
    }
    @Post('ask')
    async askFriend(@Req() req: Request, @Body() body: {pseudo: string})
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data');
		if (!body.pseudo)
			throw new BadRequestException('Uncomplete request');
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(body.pseudo))[0];
        
        try
        {
            if (await this.blockshipService.getIsBlocked(user.id, friend.id))
                throw new BadRequestException('Ressource not found');
            if (await this.blockshipService.getIsBlocked(friend.id, user.id))
                throw new BadRequestException('Ressource not found');
            const res = await this.friendshipService.askFriend(friend.id, user.id);
            return (res.statu);
        }
        catch (e)
		{
        	throw new UnauthorizedException('You are not able to access this data')
		}
    }
    @Post('remove')
    async removeFriend(@Req() req: Request, @Body() body: {pseudo: string})
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data');
		if (!body.pseudo)
			throw new BadRequestException('Uncomplete request');
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
        	throw new UnauthorizedException('You are not able to access this data')
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
