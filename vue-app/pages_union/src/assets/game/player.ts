import { Racket } from './racket';

export class Player {
	racket: Racket | null;
	name: string | null;
	side: boolean | null;
	score = 0;

	constructor() {
		this.racket = null;
		this.name = null;
		this.side = null;
	}
}