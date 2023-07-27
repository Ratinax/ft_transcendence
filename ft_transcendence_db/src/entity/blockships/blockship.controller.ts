import { Controller, Get, Param } from '@nestjs/common';
import { BlockshipService } from './blockship.service';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService) {}
    @Get('')
    async findAll()
    {
        return (await this.blockshipService.findAll());
    }
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
