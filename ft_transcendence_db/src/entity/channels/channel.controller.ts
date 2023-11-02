import { BadRequestException, Body, Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';


@Controller('channels')
export class ChannelController {
    constructor (private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly userService: UserService) {}

    @Get('')
    async find(@Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException('User not found');
        const channels = await this.channelsUsersService.findChannelsOfUsers(user.id);
        let res = [];
        for (let i = 0; i < channels.length; i++)
        {
            res.push({...channels[i],
                isUserOwner: await this.channelsUsersService.getIsUserOwner(channels[i].channel_id, user.id)});
        }
        return (res);
    }

    @Post('setPassword')
    async setPassword(@Body() body: {channel: {channel_id: number}, password: string}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.setPassword(body.channel.channel_id, body.password));
    }

    @Post('toPublic')
    async toPublic(@Body() body: {channel: {channel_id}}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPublic(body.channel.channel_id));
    }

    @Post('changePassword')
    async changePassword(@Body() body: {channel: {channel_id: number}, password: string}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.changePassword(body.channel.channel_id, body.password));
    }

    @Post('toPrivate')
    async toPrivate(@Body() body: {channel: {channel_id: number}}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        if (!await this.checkIfUserOwner(req.cookies['SESSION_KEY'], body.channel.channel_id))
            return (false);
        return (await this.channelService.toPrivate(body.channel.channel_id));
    }

    async checkIfUserOwner(cookie: string, channel_id: number)
    {
        const user = await this.sessionService.getUser(cookie);
        if (!user)
            return (false);
        const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
        if (!relation.isOwner)
            return (false);
        return (true);
    }

    @Get('category/:name')
    async getState(@Param('name') name: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const channel = (await this.channelService.findByName(name))[0];
        if (!channel)
            throw new BadRequestException('Channel not found');
        return (channel.category);
    }

    @Post('initDM')
    async initDM(@Body() body: {pseudo: string}, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
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
            return (false);
        }
    }
}
