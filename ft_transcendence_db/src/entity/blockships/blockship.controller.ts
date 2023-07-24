import { Controller, Get } from '@nestjs/common';
import { BlockshipService } from './blockship.service';

@Controller('blockships')
export class BlockshipController {
    constructor (private readonly blockshipService: BlockshipService) {}
    @Get('')
    async findAll()
    {
        return (await this.blockshipService.findAll());
    }
}
