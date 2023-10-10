import { gameOptions } from "../entities/game.entity";

export class SuccessJoinDto {
	options: gameOptions;
	side: boolean;
}