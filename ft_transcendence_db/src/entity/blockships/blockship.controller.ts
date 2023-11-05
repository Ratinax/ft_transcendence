import { BadRequestException, Body, Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { BlockshipService } from './blockship.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';
import { FriendshipService } from '../friendships/friendship.service';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService, private readonly userService: UserService, private readonly friendshipService: FriendshipService) {}

    @Get('userblockedby')
    async findUserblockedFromId(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException();
        try 
        {
            const res = await this.blockshipService.findUserblockedFromId(user.id);
            return (res);
        }
        catch (e)
		{
        	throw new UnauthorizedException('You are not able to access this data')
		}
    }

    @Get('isBlocked/:pseudoBlocked')
    async getIsBlocked(@Param('pseudoBlocked') pseudoBlocked: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(pseudoBlocked))[0];
        if (!user || !userBlocked)
            return (false);
        try 
        {
            const res = await this.blockshipService.getIsBlocked(user.id, userBlocked.id);
            if (res)
                return (true);
            else
                return (false);
        }
        catch (e)
        {
            return (false);
        }
    }

    @Get('isBlockedBy/:pseudoBlocked')
    async getIsBlockedBy(@Param('pseudoBlocked') pseudoBlocked: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(pseudoBlocked))[0];
        if (!user || !userBlocked)
            return (false);
        try 
        {
            const res = await this.blockshipService.getIsBlocked(userBlocked.id, user.id);
            if (res)
                return (true);
            else
                return (false);
        }
        catch (e)
        {
            return (false);
        }
    }


    @Post('block')
    async blockUser(@Req() req: Request, @Body() body: {pseudo: string})
    {
		if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
			throw new UnauthorizedException('You are not able to access this data');
        }
		if (!body || !body.pseudo)
			throw new BadRequestException('Uncomplete request');
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(body.pseudo))[0];
        if (!user || !userBlocked)
            throw new BadRequestException('User not found');
        try 
        {
            const res = await this.blockshipService.blockUser(user.id, userBlocked.id);
            const res2 = await this.friendshipService.clearFriendship(user.id, userBlocked.id);
            return ('Success');
        }
        catch (e)
		{
        	throw new UnauthorizedException('You are not able to access this data')
		}
    }

    @Post('unblock')
    async unblockUser(@Req() req: Request, @Body() body)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
		if (!body || !body.pseudo)
			throw new BadRequestException('Uncomplete request');
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(body.pseudo))[0];
        if (!user || !userBlocked)
            throw new BadRequestException('User not found');
        try 
        {
            await this.blockshipService.deleteBlockship(user.id, userBlocked.id);
            return ('Success');
        }
        catch (e)
		{
        	throw new UnauthorizedException('You are not able to access this data')
		}
    }
}
