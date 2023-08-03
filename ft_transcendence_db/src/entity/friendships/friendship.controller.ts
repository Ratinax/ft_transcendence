import { Controller, Get, Param, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService) {}
    /**
     * get the friend list of the user
     * 
     * @param id id of the user 
     * @returns the result of the request
     */
    @Get('friendsof/:id')
    async findFriendOfId(@Param('id') id: number)
    {
        return (await this.friendshipService.findFriendOfId(id));
    }
    /**
     * get the friend requests that have been sent to the user
     * 
     * @param id id of the user
     * @returns the result of the request
     */
    @Get('pending/:id')
    async findPending(@Param('id') id: number)
    {
        return (await this.friendshipService.findPending(id));
    }
}
