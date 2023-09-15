import { Controller, Get, Param, Req } from '@nestjs/common';
import { BlockshipService } from './blockship.service';
import { SessionService } from '../sessions/session.service';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService) {}
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
}
