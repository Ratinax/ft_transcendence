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
}
