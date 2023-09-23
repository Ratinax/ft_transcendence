import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Games } from './game.entity';

@Injectable()
export class GameService {
    constructor(
        @Inject('GAME_REPOSITORY')
        private gameRepository: Repository<Games>,
    ) {}
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
        for (let i = 0; i < games.length; i++)
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
