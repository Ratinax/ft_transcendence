import { Racket } from "./racket";

export class Ball {
	x = -200;
	y = -200;
	direction = 0;
	currentSpeed = 0;

	display(size: number, ctx: CanvasRenderingContext2D, unitRatio: number) {
		ctx.fillStyle = "white";
		ctx.fillRect((this.x / unitRatio) - (size / 2 / unitRatio), (this.y / unitRatio) - (size / 2 / unitRatio), size / unitRatio, size / unitRatio);
		// ctx.strokeStyle = "green";
		// ctx.beginPath();
		// ctx.moveTo(this.x, this.y);
		// ctx.lineTo(this.x + 50 * Math.cos(this.direction / (180 / Math.PI)), this.y + 50 * Math.sin(this.direction / (180 / Math.PI)));
		// ctx.stroke();
		// ctx.closePath();
	}

	move(frameTime: number) {
		this.x = this.x + (this.currentSpeed * frameTime) * Math.cos(this.direction / (180 / Math.PI));
		this.y = this.y + (this.currentSpeed * frameTime) * Math.sin(this.direction / (180 / Math.PI));
	}

	randomSpawn(gameWidth: number, gameHeight: number, direction: number, ballSpeed: number) {
		// const x = this.x = gameWidth / 2;
		// this.y = Math.floor(Math.random() * gameHeight);
		// if (this.y < 200)
			// this.y += 200;
		// else if (this.y > gameHeight - 200)
			// this.y -= 200;
		// const	y = this.y;
		// let	up = Math.round(Math.random() * 2);
		// if (up === 0 || up === 1)
			// up = 1;
		// else
			// up = -1;
		// this.direction = Math.round((Math.random() * 30 + 20) * up) + direction * 180;
		// if (this.direction < -180)
			// this.direction += 360;
		// else if (this.direction > 180)
			// this.direction -= 360;
		const	finalDirection = 0//this.direction;
		this.currentSpeed = ballSpeed;

		const x = this.x = gameWidth / 2;
		const y = this.y = gameHeight / 2;

		return {x: x, y: y, direction: finalDirection};
	}

	spawn(x: any, y: any, direction: any, ballSpeed: number) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.currentSpeed = ballSpeed;
	}

	wallCollision(gameHeight: number, ballSize: number) : boolean {
		if ((this.y - ballSize / 2 <= 0 && ((this.direction >= 180 && this.direction <= 360) || (this.direction >= -180 && this.direction <= 0))) || (this.y + ballSize / 2 >= gameHeight && ((this.direction > 0 && this.direction < 180) || (this.direction > -360 && this.direction < -180))))
			return true;
		return false;
	}

	racketCollision(racket: Racket, ballSize: number, racketSize: number) : boolean {
		if (((racket.x + racket.w / 2 >= this.x - ballSize / 2 && racket.x - racket.w / 2 <= this.x - ballSize / 2) ||
		(racket.x + racket.w / 2 >= this.x + ballSize / 2 && racket.x - racket.w / 2 <= this.x + ballSize / 2)) &&
		((racket.y + racketSize / 2 >= this.y - ballSize / 2 && racket.y - racketSize / 2 <= this.y - ballSize / 2) ||
		(racket.y + racketSize / 2 >= this.y + ballSize / 2 && racket.y - racketSize / 2 <= this.y + ballSize / 2)))
			return true;
		return false;
	}

	score(gameWidth: number, ballSize: number) : number {
		if (this.x - ballSize / 2 <= 0)
			return 2;
		if (this.x + ballSize / 2 >= gameWidth)
			return 1;
		return 0;
	}
}