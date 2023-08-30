import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { SessionService } from '../sessions/session.service';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService, private readonly sessionService: SessionService) {}
    /**
     * get the friend list of the user
     * 
     * @param id id of the user 
     * @returns the result of the request
     */
    @Get('friendsof/:id')
    async findFriendOfId(@Param('id') id: number, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        return (await this.friendshipService.findFriendOfId(id));
    }
    /**
     * get the friend requests that have been sent to the user
     * 
     * @param id id of the user
     * @returns the result of the request
     */
    @Get('pending/:id')
    async findPending(@Param('id') id: number, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        return (await this.friendshipService.findPending(id));
    }
}
