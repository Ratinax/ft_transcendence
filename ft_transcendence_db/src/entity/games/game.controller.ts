import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';
import { SessionService } from '../sessions/session.service';

@Controller('games')
export class GameController {
    constructor (private readonly gameService: GameService, private readonly sessionService: SessionService) {}

    @Post()
    async createGame(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        return (await this.gameService.createGame(body))
    }
    @Get('games-wins')
    async getGamesAndWins(@Body() body, @Req() req)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        {
            return (null);
        }
        const user = await this.sessionService.getUser(req.cookies['SESSION_KEY']);
        console.log(user);
        return (await this.gameService.getGamesAndWins(user.id))
    }
}
