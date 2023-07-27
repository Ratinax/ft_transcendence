import { Controller, Get, Param } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService) {}
    @Get('')
    async findAll()
    {
        return (await this.friendshipService.findAll());
    }
    @Get('friendsof/:id')
    async findFriendOfId(@Param('id') id: number)
    {
        return (await this.friendshipService.findFriendOfId(id));
    }
    @Get('pending/:id')
    async findPending(@Param('id') id: number)
    {
        return (await this.friendshipService.findPending(id));
    }
}
