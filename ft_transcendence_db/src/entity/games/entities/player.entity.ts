export class Player {
	name: string;
	id: string;
	score = 0;
	isConnected = false;
	firstPing = false;
	secondPing = false;
	nbLoop = 0;

	constructor(name: string, id: string) {
		this.name = name;
		this.id = id;
	}
}