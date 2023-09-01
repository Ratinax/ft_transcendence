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
    @Get('friendsof/')
    async findFriendOfId(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        return (await this.friendshipService.findFriendOfId(user.id));
    }
    /**
     * get the friend requests that have been sent to the user
     * 
     * @param req 
     * @returns the result of the request
     */
    @Get('pending/')
    async findPending(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        return (await this.friendshipService.findPending(user.id));
    }
}
