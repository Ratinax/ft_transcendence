import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';


@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}
    /**
     * get channel list of a user
     * 
     * @param user_id id of user
     * @returns result of request
     */
    @Get('')
    async find(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const channels = await this.channelsUsersService.findChannelsOfUsers(user.id);
        return (channels);
    }
    /**
     * set password to channel and Protected by password as category
     * 
     * @param body {channel, password}
     * @returns result of request
     */
    @Post('setPassword')
    async setPassword(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        // TODO check if user can do that
        return (await this.channelService.setPassword(body.channel, body.password));
    }
    /**
     * remove password to channel and set Public to category
     * 
     * @param body {channel}
     * @returns result of request
     */
    @Post('removePassword')
    async removePassword(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        // TODO check if user can do that
        return (await this,this.channelService.removePassword(body.channel));
    }

    @Post('changePassword')
    async changePassword(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        // TODO check if user can do that
        return (await this.channelService.changePassword(body.channel, body.password));
    }
}
