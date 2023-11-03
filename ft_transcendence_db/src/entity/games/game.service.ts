import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Games } from './game.entity';
import { Game, gameOptions } from './entities/game.entity';
import { Player } from './entities/player.entity';
import { Server } from 'socket.io';

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

	createCustomGame(playerName: string, playerId: string, options: gameOptions) {
		const	newGame = new Game(false, 4);
		newGame.leftPlayer = new Player(playerName, playerId);
		newGame.leftPlayer.isConnected = true;
		newGame.options = options;
		this.games.push(newGame);
		return {side: true, options: newGame.options};
	}

	joinCustomGame(playerName: string, playerId: string, gameIndex: number) {
		this.games[gameIndex].rightPlayer = new Player(playerName, playerId);
		this.games[gameIndex].rightPlayer.isConnected = true;
		this.games[gameIndex].isFull = true;
		return {side: false, options: this.games[gameIndex].options};
	}

	addToGame(playerName: string, mode: number, playerId: string) {
		for (let i = 0; i < this.games.length; i++) {
			if (this.games[i].mode === mode && !this.games[i].isFull) {
				this.games[i].rightPlayer = new Player(playerName, playerId);
				this.games[i].rightPlayer.isConnected = true;
				this.games[i].isFull = true;
				return {side: false, options: this.games[i].options};
			}
		}
		const	newGame = new Game(false, mode);
		newGame.leftPlayer = new Player(playerName, playerId);
		newGame.leftPlayer.isConnected = true;
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

	checkConnection(server: Server) {
		let removeGame = false;
		for (let i = 0; i < this.games.length; i++) {
			removeGame = false;
			if (this.games[i].leftPlayer)
				this.games[i].leftPlayer.nbLoop++;
			if (this.games[i].leftPlayer?.nbLoop >= 3)
			{
				this.games[i].leftPlayer.nbLoop = 0;
				if (!(this.games[i].leftPlayer.firstPing && this.games[i].leftPlayer.secondPing))
				{
					if (this.games[i].leftPlayer?.isConnected && this.games[i].rightPlayer)
					{
						this.games[i].rightPlayer.score = this.games[i].options.winScore;
						server.to(this.games[i].rightPlayer.id).emit('opponentGaveUp', {score: this.games[i].options.winScore});
					}
					this.games[i].leftPlayer.isConnected = false;
					if (!this.games[i].isFull)
						removeGame = true;
				}
				this.games[i].leftPlayer.firstPing = false;
				this.games[i].leftPlayer.secondPing = false;
			}

			if (this.games[i].rightPlayer)
				this.games[i].rightPlayer.nbLoop++;
			if (this.games[i].rightPlayer?.nbLoop >= 3)
			{
				this.games[i].rightPlayer.nbLoop = 0;
				if (!(this.games[i].rightPlayer.firstPing && this.games[i].rightPlayer.secondPing))
				{
					if (this.games[i].rightPlayer?.isConnected && this.games[i].leftPlayer)
					{
						this.games[i].leftPlayer.score = this.games[i].options.winScore;
						server.to(this.games[i].leftPlayer.id).emit('opponentGaveUp', {score: this.games[i].options.winScore});
					}
					this.games[i].rightPlayer.isConnected = false;
					if (!this.games[i].isFull)
						removeGame = true;
				}
				this.games[i].rightPlayer.firstPing = false;
				this.games[i].rightPlayer.secondPing = false;
			}
			if (removeGame)
			{
				this.games.splice(i, 1);
				i--;
			}
		}
	}

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
				nickname: game.playerOne.nickname,
                pseudo: game.playerOne.pseudo,
                profilPic: (game.playerOne.is42User && !game.playerOne.hasPersoPP) ? game.playerOne.profilPic : `http://${process.env.IP_ADDRESS}:3000/users/image/${game.playerOne.profilPic}`,
            },
            playerTwo: {
				nickname: game.playerTwo.nickname,
                pseudo: game.playerTwo.pseudo,
                profilPic: (game.playerTwo.is42User && !game.playerTwo.hasPersoPP) ? game.playerTwo.profilPic : `http://${process.env.IP_ADDRESS}:3000/users/image/${game.playerTwo.profilPic}`,

            },
            scorePlayerOne: game.scorePOne,
            scorePlayerTwo: game.scorePTwo,
			mode: game.mode
            }));
        return (gameHistory);
    }
}
