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
	spawnTime = 3500;

	opponentStatus = false;
	opponentDirection = 0;

	score = false;
	isOver = false;

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
		this.ctx.closePath();
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
		if (this.isWaiting && !this.isOver)
		{
			this.ctx.fillStyle = 'black';
			this.ctx.fillRect(this.width / 2 - 125, this.height / 2 - 125, 250, 250);
			this.ctx.fillStyle = 'white';
			this.ctx.font = "250px Comic Sans MS";
			this.ctx.fillText(`${Math.round((performance.now() - this.waiting_timer - this.spawnTime) / -1000)}`, this.width / 2 - 70, this.height / 2 + 80);
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

		if (this.opponentDirection === 1 && this.opponent.racket)
			this.opponent.racket.up(this.frameTime, this.options.playerSpeed, this.options.playerSize);
		if (this.opponentDirection === -1 && this.opponent.racket)
			this.opponent.racket.down(this.frameTime, this.options.playerSpeed, this.options.playerSize, this.height);

		if (!this.isWaiting)
			this.ball.move(this.frameTime);

		this.updateScreen();

		if (this.ball.wallCollision(this.height, this.options.ballSize) && !this.isWaiting)
			this.ball.direction = -this.ball.direction;
	
		this.frameTime = (performance.now() - this.beginTime) / 1000;
		this.beginTime = performance.now();
	}
}