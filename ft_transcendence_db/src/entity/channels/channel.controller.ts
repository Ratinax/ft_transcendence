import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';


@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly userService: UserService) {}
    /**
     * Get channels user making request is in
     * 
     * @param req already provided, used to manipulate cookies
     * @returns result of request
     */
    @Get('')
    async find(@Req() req: Request)
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
     * Set a password on chan
     * 
     * @param body data of channel
     * @param req already provided, used to manipulate cookies
     * @returns result of request
     */
    @Post('setPassword')
    async setPassword(@Body() body: {channel: {channel_id: number}, password: string}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.setPassword(body.channel.channel_id, body.password));
    }
    /**
     * Make a channel public
     * 
     * @param body channel
     * @param req already provided, used to manipulate cookies
     * @returns result of request
     */
    @Post('toPublic')
    async toPublic(@Body() body: {channel: {channel_id}}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPublic(body.channel.channel_id));
    }

    /**
     * Change password of a channel
     * 
     * @param body channel
     * @param req already provided, used to manipulate cookies
     * @returns result of request
     */
    @Post('changePassword')
    async changePassword(@Body() body: {channel: {channel_id: number}, password: string}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.changePassword(body.channel.channel_id, body.password));
    }
    /**
     * Make a channel private
     * 
     * @param body channel
     * @param req already provided, used to manipulate cookies
     * @returns result of request
     */
    @Post('toPrivate')
    async toPrivate(@Body() body: {channel: {channel_id: number}}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPrivate(body.channel.channel_id));
    }
    /**
     * Check if user ok cookie is Owner in a channel
     * 
     * @param cookie 
     * @param channel_id 
     * @returns result of request
     */
    async checkIfUserOwner(cookie: string, channel_id: number)
    {
        const user = await this.sessionService.getUser(cookie);
        const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
        if (!relation.isOwner)
            return (false);
        return (true);
    }
    /**
     * Get category of a channel
     * 
     * @param name name of channel
     * @param req already provided, used to manipulate cookies
     * @returns category of channel
     */
    @Get('category/:name')
    async getState(@Param('name') name: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const channel = (await this.channelService.findByName(name))[0];
        return (channel.category);
    }
    /**
     * Init a DM conv between user making request and user provided
     * 
     * @param body pseudo of 2nd user of dm
     * @param req already provided, used to manipulate cookies
     * @returns null || false || channel.name
     */
    @Post('initDM')
    async initDM(@Body() body: {pseudo: string}, @Req() req: Request)
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
