import { Controller, Post, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { Response } from 'express';

@Controller('sessions')
export class SessionController {
    constructor (private readonly sessionService: SessionService) {}
    @Post('pingBack')
    async test(@Req() req, @Res({passthrough: true}) res: Response)
    {
        const sessionCookie = await this.sessionService.refreshSessionKey(req.cookies['SESSION_KEY']);
        if (!sessionCookie)
            return (null);
        res.cookie('SESSION_KEY', sessionCookie.sessionKey, {httpOnly: true, expires: new Date(sessionCookie.expirationDate)});

    }
}
