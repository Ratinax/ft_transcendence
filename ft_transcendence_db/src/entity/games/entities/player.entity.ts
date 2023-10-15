import { Racket } from './racket.entity';

export class Player {
	name: string;
	id: string;
	score = 0;
	isConnected = false;
	// racket: Racket | null;
	// name: string | null;
	// side: boolean | null;
	// score = 0;
	// socket: string | null;
	// id: number | null;

	constructor(name: string, id: string) {
		this.name = name;
		this.id = id;
	}
	// constructor() {
		// this.racket = null;
		// this.name = null;
		// this.side = null;
		// this.socket = null;
		// this.id = null;
	// }
}