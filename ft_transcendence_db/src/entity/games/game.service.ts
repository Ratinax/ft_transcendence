import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Games } from './game.entity';
import { Game, gameOptions } from './entities/game.entity';
import { Player } from './entities/player.entity';
import { Ball } from './entities/ball.entity';
import { Racket } from './entities/racket.entity';

@Injectable()
export class GameService {
    constructor(
        @Inject('GAME_REPOSITORY')
        private gameRepository: Repository<Games>,
    ) {}
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

	getGameIndex(playerName: string) {
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i].leftPlayer?.name === playerName || this.games[i].rightPlayer?.name === playerName)
				return i;
		}
		return -1;
	}

	getGameIndexFromId(playerId: string) {
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i].leftPlayer?.id === playerId || this.games[i].rightPlayer?.id === playerId)
				return i;
		}
		return -1;
	}

	addToGame(playerName: string, mode: number, playerId: string) {
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i].mode === mode && !this.games[i].isFull) {
				this.games[i].leftPlayer = new Player(playerName, playerId);
				this.games[i].leftPlayer.isConnected = true;
				this.games[i].isFull = true;
				return {side: false, options: this.games[i].options};
			}
		}
		const	newGame = new Game(false, mode);
		newGame.rightPlayer = new Player(playerName, playerId);
		newGame.rightPlayer.isConnected = true;
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
		this.games.push(newGame);
		return {side: true, options: newGame.options};
	}

	// addToGame(playerId: number, name: string, mode: number, isCustom: boolean, playerSocket: string) {
		// for (let i = 0; i < this.games.length; i++) {
			// if (this.games[i].mode === mode && !this.games[i].isFull)
			// {
				// this.games[i].opponent = new Player();
				// this.games[i].opponent.id = playerId;
				// this.games[i].opponent.socket = playerSocket;
				// this.games[i].opponent.name = name;
				// this.games[i].opponent.side = !this.games[i].player.side;
				// this.games[i].opponent.racket = new Racket(this.games[i].opponent.side, this.games[i].width, this.games[i].height);
				// this.games[i].isFull = true;
				// return this.games[i].opponent.side;
			// }
		// }
		// const newGame = new Game();
		// newGame.ball = new Ball();
		// switch (mode) {
			// case 1:
				// newGame.options = this.slowOptions;
				// break;
			// case 2:
				// newGame.options = this.classicOptions;
				// break;
			// case 3:
				// newGame.options = this.fastOptions;
				// break;
		// }
		// newGame.player = new Player();
		// newGame.player.id = playerId;
		// newGame.player.socket = playerSocket;
		// newGame.player.name = name;
		// newGame.player.side = true;
		// newGame.player.racket = new Racket(newGame.player.side, newGame.width, newGame.height);
		// newGame.mode = mode;
		// newGame.isCustom = isCustom;
		// if (isCustom && !newGame.creatorId)
			// newGame.creatorId = playerId;
		// this.games.push(newGame);
		// return newGame.player.side;
	// }
// 
	// getGameIndexFromSocket(playerSocket: string) {
		// for (let i = 0; i < this.games.length; i++) {
			// if ((this.games[i].player && this.games[i].player.socket && this.games[i].player.socket === playerSocket) || ( this.games[i].opponent && this.games[i].opponent.socket && this.games[i].opponent.socket === playerSocket))
				// return i;
		// }
		// return -1;
	// }
// 
	// getGameIndexFromId(playerId: number) {
		// for (let i = 0; i < this.games.length; i++) {
			// if ((this.games[i].player && this.games[i].player.socket && this.games[i].player.id === playerId) || ( this.games[i].opponent && this.games[i].opponent.socket && this.games[i].opponent.id === playerId))
				// return i;
		// }
		// return -1;
	// }
// 
	// joinQuickPlay(playerId: number, name: string, mode: number, playerSocket: string) {
		// const	side = this.addToGame(playerId, name, mode, false, playerSocket);
		// console.log(this.games);
		// switch(mode) {
			// case 1:
				// return {options: this.slowOptions, side: side};
			// case 2:
				// return {options: this.classicOptions, side: side};
			// case 3:
				// return {options: this.fastOptions, side: side};
		// }
	// }

<<<<<<< HEAD
=======
	getGameIndexFromId(playerId: number) {
		for (let i = 0; i < this.games.length; i++) {
			if ((this.games[i].player && this.games[i].player.socket && this.games[i].player.id === playerId) || ( this.games[i].opponent && this.games[i].opponent.socket && this.games[i].opponent.id === playerId))
				return i;
		}
		return -1;
	}

	joinQuickPlay(playerId: number, name: string, mode: number, playerSocket: string) {
		const	side = this.addToGame(playerId, name, mode, false, playerSocket);
		switch(mode) {
			case 1:
				return {options: this.slowOptions, side: side};
			case 2:
				return {options: this.classicOptions, side: side};
			case 3:
				return {options: this.fastOptions, side: side};
		}
	}
>>>>>>> e6ba6ecddb1cfcda1944e64f726d4f792249bd14
    async createGame(game: Partial<Games>)
    {
        const newChannel = this.gameRepository.create(game);
        const res = await this.gameRepository.save(newChannel);
        return (res);
    }

	async getGamesAndWins(user_id: Number)
    {
        const games = await this.gameRepository.createQueryBuilder('games')
        .innerJoinAndSelect('games.playerOne', 'playerOne')
        .innerJoinAndSelect('games.playerTwo', 'playerTwo')
        .where('playerOne.id = :user_id OR playerTwo.id = :user_id', { user_id: user_id })
        .getMany();
        const count_games = games.length;
        let count_win = 0;
        for (let i = 0; i < count_games; i++)
        {
            if (games[i].playerOne.id === user_id && games[i].scorePOne > games[i].scorePTwo)
                count_win++;
            else if (games[i].playerTwo.id === user_id && games[i].scorePOne < games[i].scorePTwo)
                count_win++;
        }
        return ({nb_games: count_games, nb_wins: count_win});
    }

	async getGames(user_id: Number)
    {
        const games = await this.gameRepository.createQueryBuilder('games')
        .innerJoinAndSelect('games.playerOne', 'playerOne')
        .innerJoinAndSelect('games.playerTwo', 'playerTwo')
        .where('playerOne.id = :user_id OR playerTwo.id = :user_id', { user_id: user_id })
        .getMany();
        const gameHistory = games.map((game) => ({
            playerOne: {
                pseudo: game.playerOne.pseudo,
                profilPic: game.playerOne.is42User ? game.playerOne.profilPic : `http://${process.env.IP_ADDRESS}:3000/users/images/${game.playerOne.profilPic}`,
            },
            playerTwo: {
                pseudo: game.playerTwo.pseudo,
                profilPic: game.playerTwo.is42User ? game.playerTwo.profilPic : `http://${process.env.IP_ADDRESS}:3000/users/images/${game.playerTwo.profilPic}`,

            },
            scorePlayerOne: game.scorePOne,
            scorePlayerTwo: game.scorePTwo,
            }));
        return (gameHistory);
    }
}
