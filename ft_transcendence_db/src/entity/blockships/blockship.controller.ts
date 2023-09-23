import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { BlockshipService } from './blockship.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService, private readonly userService: UserService) {}
    /**
     * get list of users blocked from user
     * 
     * @param id id of user
     * @returns result of request
     */
    @Get('userblockedby')
    async findUserblockedFromId(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        try 
        {
            const res = await this.blockshipService.findUserblockedFromId(user.id);
            return (res);
        }
        catch (e)
        {
            return (null);
        }
    }
    @Get('isBlocked/:pseudoBlocked')
    async getIsBlocked(@Param('pseudoBlocked') pseudoBlocked: string, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(pseudoBlocked))[0];
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
    @Post('block')
    async blockUser(@Req() req, @Body() body)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(body.pseudo))[0];
        try 
        {
            const res = await this.blockshipService.blockUser(user.id, userBlocked.id);
            return ('Success');
        }
        catch (e)
        {
            return (null);
        }
    }
    @Post('unblock')
    async unblockUser(@Req() req, @Body() body)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const userBlocked = (await this.userService.getUser(body.pseudo))[0];
        try 
        {
            const res = await this.blockshipService.deleteBlockship(user.id, userBlocked.id);
            return ('Success');
        }
        catch (e)
        {
            return (null);
        }
    }
}
