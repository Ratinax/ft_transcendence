import { Repository } from 'typeorm';
import { Games } from './game.entity';
export declare class GameService {
    private gameRepository;
    constructor(gameRepository: Repository<Games>);
    createGame(game: Partial<Games>): Promise<Games>;
}
