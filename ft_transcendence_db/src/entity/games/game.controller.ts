import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
    constructor (private readonly gamseService: GameService) {}
}
