import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { BlockshipService } from './blockship.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService, private readonly userService: UserService) {}

    /**
     * get users blocked by the one making the request
     * 
     * @param req already provided, used to manipulate cookies
     * @returns null | Array<id: number, pseudo: string, profilPic: string>
     */
    @Get('userblockedby')
    async findUserblockedFromId(@Req() req: Request)
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
    /**
     * get if user provided is blocked by user making the request
     * 
     * @param pseudoBlocked pseudo of user who's checked blocked
     * @param req already provided, used to manipulate cookies
     * @returns true | false | null
     */
    @Get('isBlocked/:pseudoBlocked')
    async getIsBlocked(@Param('pseudoBlocked') pseudoBlocked: string, @Req() req: Request)
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
    /**
     * block user
     * 
     * @param req already provided, used to manipulate cookies
     * @param body pseudo of user going to be blocked
     * @returns null | 'Success'
     */
    @Post('block')
    async blockUser(@Req() req: Request, @Body() body: {pseudo: string})
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
    /**
     * 
     * @param req already provided, used to manipulate cookies
     * @param body pseudo of user going to be unblocked
     * @returns null | success
     */
    @Post('unblock')
    async unblockUser(@Req() req: Request, @Body() body)
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
