import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request, Response } from 'express';

@Controller('sessions')
export class SessionController {
    constructor (private readonly sessionService: SessionService) {}
    @Post('pingBack')
    async pingBack(@Req() req: Request, @Res({passthrough: true}) res: Response)
    {
        if (!req.cookies['SESSION_KEY'])
            return (null);
        const sessionCookie = await this.sessionService.refreshSessionKey(req.cookies['SESSION_KEY']);
        if (!sessionCookie)
            return (null);
        res.cookie('SESSION_KEY', sessionCookie.sessionKey, {httpOnly: true, expires: new Date(sessionCookie.expirationDate)});
    }
    @Get('cookies')
    getCookies(@Req() req: Request)
    {
        return (req.cookies['SESSION_KEY']);
    }
    @Get('isConnected/:pseudo')
    async getIsConnected(@Req() req: Request, @Param('pseudo') pseudo: string)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const res = !(await this.sessionService.getIsPseudoExpired(pseudo));
        return (res);
    }
}
