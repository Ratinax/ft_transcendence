import { GameService } from './game.service';
import { SessionService } from '../sessions/session.service';
export declare class GameController {
    private readonly gameService;
    private readonly sessionService;
    constructor(gameService: GameService, sessionService: SessionService);
    createGame(body: any, req: any): Promise<import("./game.entity").Games>;
}
