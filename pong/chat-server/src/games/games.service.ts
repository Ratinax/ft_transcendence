import { Injectable } from '@nestjs/common';
import { Game, gameOptions } from './entities/game.entity';
import { Player } from './entities/player.entity';
import { Ball } from './entities/ball.entity';
import { Racket } from './entities/racket.entity';

@Injectable()
export class GamesService {
	games: Game[] = [];
	classicOptions: gameOptions = {
		ballAccel: 100,
		ballSize: 30,
		ballSpeed: 1200,
		maxAngle: 45,
		playerSize: 300,
		playerSpeed: 1700,
		winScore: 5,
	}

	slowOptions: gameOptions = {
		ballAccel: 50,
		ballSize: 30,
		ballSpeed: 800,
		maxAngle: 45,
		playerSize: 300,
		playerSpeed: 1700,
		winScore: 3,
	}

	fastOptions: gameOptions = {
		ballAccel: 150,
		ballSize: 30,
		ballSpeed: 1600,
		maxAngle: 45,
		playerSize: 300,
		playerSpeed: 1800,
		winScore: 7,
	}

	addToGame(playerId: string, name: string, mode: number, isCustom: boolean) {
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i].mode === mode && !this.games[i].isFull)
			{
				this.games[i].opponent = new Player();
				this.games[i].opponent.id = playerId;
				this.games[i].opponent.name = name;
				this.games[i].opponent.side = !this.games[i].player.side;
				this.games[i].opponent.racket = new Racket(this.games[i].opponent.side, this.games[i].width, this.games[i].height);
				this.games[i].isFull = true;
				return this.games[i].opponent.side;
			}
		}
		const newGame = new Game();
		newGame.ball = new Ball();
		switch (mode) {
			case 1:
				newGame.options = this.slowOptions;
				break;
			case 2:
				newGame.options = this.classicOptions;
				break;
			case 3:
				newGame.options = this.fastOptions;
				break;
		}
		newGame.player = new Player();
		newGame.player.id = playerId;
		newGame.player.name = name;
		newGame.player.side = true;
		newGame.player.racket = new Racket(newGame.player.side, newGame.width, newGame.height);
		newGame.mode = mode;
		newGame.isCustom = isCustom;
		if (isCustom && !newGame.creatorId)
			newGame.creatorId = playerId;
		this.games.push(newGame);
		return newGame.player.side;
	}

	getGameIndex(playerId: string) {
		for (let i = 0; i < this.games.length; i++) {
			if ((this.games[i].player && this.games[i].player.id && this.games[i].player.id === playerId) || ( this.games[i].opponent && this.games[i].opponent.id && this.games[i].opponent.id === playerId))
				return i;
		}
		return -1;
	}

	joinQuickPlay(playerId: string, name: string, mode: number) {
		const	side = this.addToGame(playerId, name, mode, false);
		console.log(this.games);
		switch(mode) {
			case 1:
				return {options: this.slowOptions, side: side};
			case 2:
				return {options: this.classicOptions, side: side};
			case 3:
				return {options: this.fastOptions, side: side};
		}
	}

	joinGame(player_id: string, player_name: string) {
		// let hasJoin = false;
		// if (this.getGameIndex(player_id) !== -1)
		// 	return false;
		// for (let i = 0; i < this.games.length; i++) {
		// 	if (!this.games[i].isFull)
		// 	{
		// 		hasJoin = this.games[i].joinGame(player_id, player_name);
		// 		break;
		// 	}
		// }
		// if (!hasJoin)
		// {
		// 	this.games.push(new Game(this.defaultOptions));
		// 	hasJoin = this.games[this.games.length - 1].joinGame(player_id, player_name);
		// }
		// return hasJoin;
	}

	gameInfos(gameIndex: number) {
		
	}

	ready(gameIndex: number, player_id) {

	}

	startGame(gameIndex: number) {

	}

	async updateGame(gameIndex: number, x: number, y: number, player_id) {
		
	}

	endGame(gameIndex: number) {
		
	}
}