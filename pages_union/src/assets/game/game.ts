import { Ball } from "./ball";
import { Player } from "./player";

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
	player = new Player();
	opponent = new Player();
	ball = new Ball();
	options: gameOptions | null;
	frameTime = 0;
	beginTime = 0;
	isWaiting = true;
	waiting_timer = 0;
	up = false;
	down = false;
	unitRatio = 0;
	width = 2000;
	height = this.width / (4/3);
	firstLoop = true;
	dir = 1;

	canvas: HTMLCanvasElement | null;
	ctx: CanvasRenderingContext2D | null;

	constructor() {
		this.options = null;
		this.canvas = null;
		this.ctx = null;
	}

	drawMidLane() {
		if (!this.ctx || !this.canvas)
			return ;
		this.ctx.beginPath();
		this.ctx.setLineDash([50, 36]);
		this.ctx.moveTo(this.canvas.width / 2, 0);
		this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = 10;
		this.ctx.stroke();
		this.ctx.setLineDash([]);
	}

	updateScreen() {
		if (!this.ctx || !this.canvas)
			return ;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawMidLane();
		if (this.player.racket && this.options)
			this.player.racket.display(this.options.playerSize, this.ctx, this.unitRatio);
		if (this.opponent.racket && this.options)
			this.opponent.racket.display(this.options.playerSize, this.ctx, this.unitRatio);
		if (this.ball && this.options)
			this.ball.display(this.options.ballSize, this.ctx, this.unitRatio);

		this.ctx.font = "50px Comic Sans MS";
		this.ctx.fillStyle = "white";
		if (this.player.side)
		{
			this.ctx.fillText(`${this.player.score}`, 700, 100)
			this.ctx.fillText(`${this.opponent.score}`, this.canvas.width - 700, 100)
		}
		else
		{
			this.ctx.fillText(`${this.player.score}`, this.canvas.width - 700, 100)
			this.ctx.fillText(`${this.opponent.score}`, 700, 100)			
		}
	}

	update() {
		if (!this.options)
			return ;

		if (this.firstLoop)
		{
			this.waiting_timer = performance.now();
			this.firstLoop = false;
		}

		if (this.up && this.player.racket)
			this.player.racket.up(this.frameTime, this.options.playerSpeed, this.options.playerSize);
		if (this.down && this.player.racket)
			this.player.racket.down(this.frameTime, this.options.playerSpeed, this.options.playerSize, this.height);

		// if (!this.isWaiting)
			// this.ball.move(this.frameTime);

		// if (this.isWaiting && performance.now() >= this.waiting_timer + 2000)
		// {
			// this.isWaiting = false;
			// this.ball.spawn(this.width, this.height, this.dir, this.options.ballSpeed);
		// }

		this.updateScreen();

		let	hitModulo
		if (this.ball.wallCollision(this.height, this.options.ballSize) && !this.isWaiting)
			this.ball.direction = -this.ball.direction;
		else if (this.player.racket && this.ball.racketCollision(this.player.racket, this.options.ballSize, this.options.playerSize)) //&& (((this.ball.direction > 90 || this.ball.direction < -90) && this.player.side === true) || ((this.ball.direction < 90 || this.ball.direction > -90) && this.player.side === false)))
		{
			hitModulo = (this.ball.y - this.player.racket.y + this.options.playerSize / 2) / this.options.playerSize * 2 - 1;
			if (hitModulo > 1)
				hitModulo = 1;
			else if (hitModulo < -1)
				hitModulo = -1;
			this.ball.direction = hitModulo * this.options.maxAngle;
			if (this.player.side === false)
				this.ball.direction = 180 - this.ball.direction;
			this.ball.currentSpeed += this.options.ballAccel;
		}
		else if (this.opponent.racket && this.ball.racketCollision(this.opponent.racket, this.options.ballSize, this.options.playerSize))// && ((Math.cos(this.ball.direction / (180 / Math.PI)) > 0 && this.opponent.side === false) || (Math.cos(this.ball.direction / (180 / Math.PI)) < 0 && this.opponent.side === true)))
		{
			hitModulo = (this.ball.y - this.opponent.racket.y + this.options.playerSize / 2) / this.options.playerSize * 2 - 1;
			if (hitModulo > 1)
				hitModulo = 1;
			else if (hitModulo < -1)
				hitModulo = -1;
			this.ball.direction = hitModulo * this.options.maxAngle;
			if (this.opponent.side === false)
				this.ball.direction = 180 - this.ball.direction;
			this.ball.currentSpeed += this.options.ballAccel;
		}

		// const goal = this.ball.score(this.width, this.options.ballSize);
		// if (goal)
		// {
			// if (goal === 1 && !this.isWaiting)
			// {
				// if (this.player.side === true)
					// this.player.score++;
				// else if(this.opponent.side === true)
					// this.opponent.score++;
				// this.ball.x = -200;
				// this.ball.y = -200;
				// this.isWaiting = true;
				// this.waiting_timer = performance.now();
				// this.dir = 0;
			// }
			// else if (goal === 2 && !this.isWaiting)
			// {
				// if (this.opponent.side === false)
					// this.opponent.score++;
				// else if (this.player.side === false)
					// this.player.score++;
				// this.ball.x = -200;
				// this.ball.y = -200;
				// this.isWaiting = true;
				// this.waiting_timer = performance.now();
				// this.dir = 1;
			// }
		// }

		this.frameTime = (performance.now() - this.beginTime) / 1000;
		this.beginTime = performance.now();
	}
}