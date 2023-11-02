export class Player {
	name: string;
	id: string;
	score = 0;
	isConnected = true;
	firstPing = true;
	secondPing = true;
	nbLoop = 0;
	updateInGame = false;

	constructor(name: string, id: string) {
		this.name = name;
		this.id = id;
	}
}