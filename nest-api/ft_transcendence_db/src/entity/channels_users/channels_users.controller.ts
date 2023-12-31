import { Get, Controller, Req, Body, Query, Param, Post, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ChannelsUsersService } from './channels_users.service';
import { SessionService } from '../sessions/session.service';
import { Request } from 'express';

@Controller('channels_users')
export class ChannelsUsersController {
    constructor (private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}

    @Get('userPerms')
    async getUserWithPermissions(@Req() req: Request, @Query('channelId') channelId: number)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException('Ressource not found');
        const res = await this.channelsUsersService.findRelation(user.id, channelId);
        if (!res || !res[0])
            throw new BadRequestException('Ressource not found');
        const userPerms = {
            id: user.id,
            isAdmin: res[0].isAdmin,
            isOwner: res[0].isOwner,
            isBanned: res[0].isBanned, 
        }
        return (userPerms);
    }

    @Get('bannedUsers/:channelId')
    async getBAnnedUsers(@Param('channelId') channelId: number, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException('Ressource not found');
        const res = (await this.channelsUsersService.findRelation(user.id, channelId))[0];
        if (!res.isAdmin)
            return (false);
        const users = await this.channelsUsersService.findBannedUsers(channelId);
        return (users);
    }

    @Post('unBan')
    async unBan(@Req() req: Request, @Body() body: {channel: {channel_id: number}, user: {id: number}})
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data');
		if (!body.channel || !body.channel.channel_id || !body.user || !body.user.id)
			throw new BadRequestException('Uncomplete request');
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        if (!user)
            throw new BadRequestException('Ressource not found');
        const res = (await this.channelsUsersService.findRelation(user.id, body.channel.channel_id))[0];
        if (!res.isOwner)
            return (false);
        const result = await this.channelsUsersService.unBan(body.channel, body.user);
        if (result)
            return (true);
        return (false);
    }

}
