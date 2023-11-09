export class Racket {
	x: number;
	y: number;
	w = 30;

	constructor(side: boolean, gameWidth: number, gameHeight: number) {
		if (side)
			this.x = 70;
		else
			this.x = gameWidth - 70;
		this.y = gameHeight / 2;
	}

	display(size: number, ctx: CanvasRenderingContext2D, unitRatio: number) {
		ctx.fillStyle = "white";
		ctx.fillRect((this.x / unitRatio) - (this.w / 2 / unitRatio), (this.y / unitRatio) - (size / 2 / unitRatio), this.w / unitRatio, size / unitRatio);
	}

	up(frameTime: number, speed: number, size: number) {
		const newPos = this.y - (speed * frameTime);

		if (newPos - size / 2 > 0)
			this.y = newPos;
		else
			this.y = 0 + size / 2;
	}

	down(frameTime: number, speed: number, size: number, gameHeight: number) {
		const newPos = this.y + (speed * frameTime);

		if (newPos + size / 2 < gameHeight)
			this.y = newPos;
		else
			this.y = gameHeight - size / 2;
	}
}