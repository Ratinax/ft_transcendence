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
    @Get('userblockedby/:id')
    async findUserblockedFromId(@Param('id') id: number, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        try 
        {
            const res = await this.blockshipService.findUserblockedFromId(id);
            return (res);
        }
        catch (e)
        {
        }
    }
}
