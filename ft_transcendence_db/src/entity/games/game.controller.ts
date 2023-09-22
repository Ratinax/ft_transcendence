import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { SessionService } from '../sessions/session.service';
import { UserService } from '../users/user.service';

@Controller('games')
export class GameController {
    constructor (private readonly gameService: GameService, private readonly sessionService: SessionService, private readonly userService: UserService) {}

    @Post()
    async createGame(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        return (await this.gameService.createGame(body))
    }
    @Get('games-wins/:pseudo')
    async getGamesAndWins(@Param('pseudo') pseudo: string, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = (await this.userService.getUser(pseudo))[0];
        return (await this.gameService.getGamesAndWins(user.id))
    }
    @Get('match-history')
    async getGames(@Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        return (await this.gameService.getGames(user.id))
    }
    @Get('match-history/:pseudo')
    async getMatchHistory(@Param('pseudo') pseudo, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = (await this.userService.getUser(pseudo))[0];
        return (await this.gameService.getGames(user.id))
    }
    @Get('games-wins/:pseudo')
    async getGamesAndWinsId(@Param('pseudo') pseudo, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = (await this.userService.getUser(pseudo))[0];
        return (await this.gameService.getGamesAndWins(user.id))
    }
}
