import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Games } from './game.entity';

@Injectable()
export class GameService {
    constructor(
        @Inject('GAME_REPOSITORY')
        private gameRepository: Repository<Games>,
    ) {}
}
