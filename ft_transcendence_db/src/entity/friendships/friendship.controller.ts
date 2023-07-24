import { Controller, Get } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService) {}
    @Get('')
    async findAll()
    {
        return (await this.friendshipService.findAll());
    }
}
