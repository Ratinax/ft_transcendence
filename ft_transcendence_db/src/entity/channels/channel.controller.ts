import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';


@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly userService: UserService) {}
    /**
     * get channel list of a user
     * 
     * @param user_id id of user
     * @returns result of request
     */
    @Get('')
    async find(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
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
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.setPassword(body.channel, body.password));
    }
    /**
     * remove password to channel and set Public to category
     * 
     * @param body {channel}
     * @returns result of request
     */
    @Post('goPublic')
    async goPublic(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPublic(body.channel));
    }

    @Post('changePassword')
    async changePassword(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.changePassword(body.channel, body.password));
    }
    @Post('toPublic')
    async toPublic(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPublic(body.channel));
    }
    @Post('toPrivate')
    async toPrivate(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPrivate(body.channel));
    }
    async checkIfUserOwner(cookie: string, channel_id: number)
    {
        const user = await this.sessionService.getUser(cookie);
        const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
        if (!relation.isOwner)
            return (false);
        return (true);
    }
    @Get('category/:name')
    async getState(@Param('name') name: string, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const channel = (await this.channelService.findByName(name))[0];
        return (channel.category);
    }
    @Post('sendDM')
    async sendDM(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const user2 = (await this.userService.getUser(body.pseudo))[0];
        let result;
        let channel;
        try
        {
            const res = (await this.channelService.findByName(`${user.pseudo}, ${body.pseudo}`))[0];
            const res2 = (await this.channelService.findByName(`${body.pseudo}, ${user.pseudo}`))[0];
            if (res)
                channel = res;
            else if (res2)
                channel = res2;
            else
                channel = await this.channelService.createChannel({password: '', isADm: true, name: `${body.pseudo}, ${user.pseudo}`, category: 'Private'});
            result = await this.channelsUsersService.createNew({user: user, channel: channel, isAdmin: false, isOwner: false, isBanned: false})
            if (!result)
                await this.channelsUsersService.unHide(user.id, channel.channel_id);
            result = await this.channelsUsersService.createNew({user: user2, channel: channel, isAdmin: false, isOwner: false, isBanned: false})
            return (channel.name);
        }
        catch (e)
        {
            console.error(e);
            return (false);
        }
    }
}
