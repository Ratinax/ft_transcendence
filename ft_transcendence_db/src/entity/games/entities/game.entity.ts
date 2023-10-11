import { Ball } from "./ball.entity";
import { Player } from "./player.entity";

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
	player: Player | null;
	opponent: Player | null;
	ball = new Ball();
	options: gameOptions | null;
	frameTime = 0;
	beginTime = 0;
	isWaiting = true;
	waiting_timer = 0;
	width = 2000;
	height = this.width / (4/3);
	firstLoop = true;
	dir = 1;

	mode: number | null;
	isCustom: boolean | null;
	creatorId: number | null;
	isFull = false;

	constructor() {
		this.player = null;
		this.opponent = null;
		this.options = null;
		this.mode = null;
		this.isCustom = null;
		this.creatorId = null;
	}

	update() {
		if (!this.options)
			return ;

		if (this.firstLoop)
		{
			this.waiting_timer = performance.now();
			this.firstLoop = false;
		}

		if (!this.isWaiting)
			this.ball.move(this.frameTime);

		if (this.isWaiting && performance.now() >= this.waiting_timer + 2000)
		{
			this.isWaiting = false;
			this.ball.spawn(this.width, this.height, this.dir, this.options.ballSpeed);
		}


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

		const goal = this.ball.score(this.width, this.options.ballSize);
		if (goal)
		{
			if (goal === 1 && !this.isWaiting)
			{
				if (this.player.side === true)
					this.player.score++;
				else if(this.opponent.side === true)
					this.opponent.score++;
				this.ball.x = -200;
				this.ball.y = -200;
				this.isWaiting = true;
				this.waiting_timer = performance.now();
				this.dir = 0;
			}
			else if (goal === 2 && !this.isWaiting)
			{
				if (this.opponent.side === false)
					this.opponent.score++;
				else if (this.player.side === false)
					this.player.score++;
				this.ball.x = -200;
				this.ball.y = -200;
				this.isWaiting = true;
				this.waiting_timer = performance.now();
				this.dir = 1;
			}
		}

		this.frameTime = (performance.now() - this.beginTime) / 1000;
		this.beginTime = performance.now();
		return ({
			player1Score: this.player.score,
			player2Score: this.opponent.score,
			player1Side: this.player.side,
			player2Side: this.opponent.side,
			player1Pos: this.player.racket.y,
			player2Pos: this.opponent.racket.y,
			ballDir: this.ball.direction,
			ballSpeed: this.ball.currentSpeed,
			ballX: this.ball.x,
			ballY: this.ball.y
		})
	}
}