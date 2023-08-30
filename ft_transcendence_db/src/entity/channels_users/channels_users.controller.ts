import { Get, Controller, Req, Body } from '@nestjs/common';
import { ChannelsUsersService } from './channels_users.service';
import { SessionService } from '../sessions/session.service';

@Controller('channels_users')
export class ChannelsUsersController {
    constructor (private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}
    /**
     * 
     * @param req already provided, to have cookies
     * @param body {channel}
     * @returns null | user with permissions
     */
    @Get('userPerms')
    async getUserWithPermissions(@Req() req, @Body() body)
    {
        if (!req.cookies['SESSION_KEY'] || !this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
            // TODO redirect to log page
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        const res = await this.channelsUsersService.findRelation(user.id, body.channel.channel_id);
        const userPerms = {
            id: res[0].id,
            isAdmin: res[0].isAdmin,
            isOwner: res[0].isOwner,
            isInvited: res[0].isInvited,
            isBanned: res[0].isBanned, 
        }
        return (userPerms);
    }
}
