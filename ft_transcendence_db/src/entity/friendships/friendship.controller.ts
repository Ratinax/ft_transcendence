import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';

@Controller('friendships')
export class FriendshipController {
    constructor (private readonly friendshipService: FriendshipService, private readonly sessionService: SessionService, private readonly userService: UserService) {}
    /**
     * get the friend list of the user
     * 
     * @param id id of the user 
     * @returns the result of the request
     */
    @Get('friendsof/')
    async findFriendOfId(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
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
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        return (await this.friendshipService.findPending(user.id));
    }
    @Post('ask')
    async askFriend(@Req() req, @Body() body)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(body.pseudo))[0];
        try
        {
            const res = await this.friendshipService.askFriend(friend.id, user.id);
            // console.log('ca va return la', res)
            return ('pending')
        }
        catch (e)
        {
            return (e);
        }
    }
    @Post('remove')
    async removeFriend(@Req() req, @Body() body)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(body.pseudo))[0];
        try
        {
            const res = await this.friendshipService.deleteFriendship(friend.id, user.id);
            return ('')
        }
        catch (e)
        {
            return ('');
        }
    }
    @Get('friendRelation/:pseudoFriend')
    async isFriend(@Param('pseudoFriend') pseudoFriend: string, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const friend = (await this.userService.getUser(pseudoFriend))[0];
        try
        {
            const res = await this.friendshipService.getFriendRelation(friend.id, user.id);
            return (res);
        }
        catch (e)
        {
            return ('');
        }
    }
}
