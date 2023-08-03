import { Controller, Get, Param } from '@nestjs/common';
import { BlockshipService } from './blockship.service';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService) {}
    /**
     * get list of users blocked from user
     * 
     * @param id id of user
     * @returns result of request
     */
    @Get('userblockedby/:id')
    async findUserblockedFromId(@Param('id') id: number)
    {
        try 
        {
            const res = await this.blockshipService.findUserblockedFromId(id);
            return (res);
        }
        catch (e)
        {
            console.log('error truc :', e);
        }
    }
}
