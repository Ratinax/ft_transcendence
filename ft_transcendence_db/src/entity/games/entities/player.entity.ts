import { Racket } from './racket.entity';

export class Player {
	racket: Racket | null;
	name: string | null;
	side: boolean | null;
	score = 0;
	socket: string | null;
	id: number | null;

	constructor() {
		this.racket = null;
		this.name = null;
		this.side = null;
		this.socket = null;
		this.id = null;
	}
}