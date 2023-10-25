import { Ball } from "./ball.entity";
import { Player } from "./player.entity";

export interface gameOptions {
	playerSize: number;
	playerSpeed: number;
	ballSize: number;
	ballSpeed: number;
	ballAccel: number;
	maxAngle: number;
	winScore: number;
}

export class Game {
	leftPlayer: Player;
	rightPlayer: Player;
	mode: number;
	isCustom: boolean;
	creatorName = null as string | null;
	isFull = false;
	options = null as null | gameOptions;

	constructor(isCustom: boolean, mode: number) {
		this.isCustom = isCustom;
		this.mode = mode;
	}
}