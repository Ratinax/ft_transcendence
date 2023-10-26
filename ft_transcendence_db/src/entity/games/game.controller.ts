import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';
import { Request } from 'express';

@Controller('games')
export class GameController {
    constructor (private readonly gameService: GameService, private readonly sessionService: SessionService, private readonly userService: UserService) {}

    @Get('games-wins/:pseudo')
    async getGamesAndWins(@Param('pseudo') pseudo: string, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = (await this.userService.getUser(pseudo))[0];
        if (!user)
            return (null);
        return (await this.gameService.getGamesAndWins(user.id))
    }

    @Get('match-history/:pseudo')
    async getMatchHistory(@Param('pseudo') pseudo: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = (await this.userService.getUser(pseudo))[0];
        if (user)
            return (await this.gameService.getGames(user.id));
        return (false);
    }
}
