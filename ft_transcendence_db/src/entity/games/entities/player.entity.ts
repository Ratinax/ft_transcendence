import { Racket } from './racket.entity';

export class Player {
	racket: Racket | null;
	name: string | null;
	side: boolean | null;
	score = 0;
	id: string | null;

	constructor() {
		this.racket = null;
		this.name = null;
		this.side = null;
		this.id = null;
	}
}