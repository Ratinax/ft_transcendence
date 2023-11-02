import { BadRequestException, Body, Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
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
        	throw new UnauthorizedException('You are not able to access this data')
        const user = (await this.userService.getUser(pseudo))[0];
        if (!user)
			throw new BadRequestException('Ressource not found');
        return (await this.gameService.getGamesAndWins(user.id))
    }

    @Get('match-history/:pseudo')
    async getMatchHistory(@Param('pseudo') pseudo: string, @Req() req: Request)
    {
        if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
        	throw new UnauthorizedException('You are not able to access this data')
        const user = (await this.userService.getUser(pseudo))[0];
        if (user)
            return (await this.gameService.getGames(user.id));
        return (false);
    }

	@Get('gameOptions/:pseudo')
	async getGameOptions(@Param('pseudo') pseudo: string, @Req() req: Request) {
		if (!req.cookies['SESSION_KEY'] || await this.sessionService.getIsSessionExpired(req.cookies['SESSION_KEY']))
			throw new UnauthorizedException('You are not able to access this data');
		const gameIndex = this.gameService.getGameIndex(pseudo);
		if (gameIndex === -1)
			return {inGame: false};
		let	name = '';
		let side = false;
		if (this.gameService.games[gameIndex].leftPlayer.name === pseudo)
		{
			name = this.gameService.games[gameIndex].rightPlayer.name;
			side = true;
		}
		else if (this.gameService.games[gameIndex].rightPlayer.name === pseudo)
		{
			name = this.gameService.games[gameIndex].leftPlayer.name;
			side = false;
		}
		return JSON.stringify({inGame: true, options: this.gameService.games[gameIndex].options, side: side, opponentName: name});
	}
}
