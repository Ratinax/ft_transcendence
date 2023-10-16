<template>
	<div>
		<div class="page-background"></div>
		<div class="container">
			<div>
				<div>
					<canvas></canvas>
				</div>
				<p>latency: {{latency}}ms</p>
				<p>opponent latency: {{opponentLatency}}ms</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { Ball } from "../assets/game/ball";
import { Game, gameOptions } from "../assets/game/game";
import { Player } from "../assets/game/player";
import { Racket } from "../assets/game/racket";
import { io } from 'socket.io-client';
import axios from 'axios';

const	socket = io(`http://${process.env.VUE_APP_IP}:3004/`);

const	start = ref(false);
let		name = '';

const	game = new Game();

const	latency = ref(0);
const	opponentLatency = ref(0);
let		ping = 0;

game.player = new Player();
game.opponent = new Player();

game.ball = new Ball();

window.addEventListener('keydown', e => {
		if (e.key === "w" || e.key === "Z" || e.key === "z" || e.key === "Z")
			game.up = true;
		if (e.key === "s" || e.key === "S")
			game.down = true;
	})

	window.addEventListener('keyup', e => {
		if (e.key === "w" || e.key === "Z" || e.key === "z" || e.key === "Z")
			game.up = false;
		if (e.key === "s" || e.key === "S")
			game.down = false;
	});

function spawnBall() {
	if (game.isWaiting && performance.now() >= game.waiting_timer + 2000)
	{
		if (game.score)
		{
			game.isWaiting = false;
			game.score = false;
			const	spawnOptions = game.ball.randomSpawn(game.width, game.height, game.dir, game.options.ballSpeed);
			socket.emit('spawnBallInfos', spawnOptions);
		}
	}
}

function playerCollision() {
	let	hitModulo;

	if (game.player.racket && game.ball.racketCollision(game.player.racket, game.options.ballSize, game.options.playerSize)) //&& (((game.ball.direction > 90 || game.ball.direction < -90) && game.player.side === true) || ((game.ball.direction < 90 || game.ball.direction > -90) && game.player.side === false)))
	{
		hitModulo = (game.ball.y - game.player.racket.y + game.options.playerSize / 2) / game.options.playerSize * 2 - 1;
		if (hitModulo > 1)
			hitModulo = 1;
		else if (hitModulo < -1)
			hitModulo = -1;
		game.ball.direction = hitModulo * game.options.maxAngle;
		if (game.player.side === false)
			game.ball.direction = 180 - game.ball.direction;
		game.ball.currentSpeed += game.options.ballAccel;
		socket.emit('bounce', {x: game.player.racket.x, y: game.ball.y, direction: game.ball.direction, speed: game.ball.currentSpeed});
	}
}

function checkGoal() {
	const goal = game.ball.score(game.width, game.options.ballSize);
	if (goal)
	{
		if (goal === 1 && !game.isWaiting && game.player.side === true)
		{
			game.player.score++;
			game.ball.x = -200;
			game.ball.y = -200;
			game.isWaiting = true;
			game.waiting_timer = performance.now();
			game.dir = 0;
			game.score = true;
			return true;
		}
		else if (goal === 2 && !game.isWaiting && game.player.side === false)
		{
			game.player.score++;
			game.ball.x = -200;
			game.ball.y = -200;
			game.isWaiting = true;
			game.waiting_timer = performance.now();
			game.dir = 1;
			game.score = true;
			return true;
		}
	}
	return false;
}

function launch() {
	const	canvas = document.querySelector('canvas');
	const	ctx = canvas?.getContext("2d");
	if (!canvas || !ctx)
		return;

	const	ratio = 4/3;
	canvas.width = 2000;
	canvas.height = canvas.width / ratio;

	game.unitRatio = 2000 / canvas.width;

	game.canvas = canvas;
	game.ctx = ctx;

	requestAnimationFrame(loop);
}

setInterval(() => {
	ping = performance.now();
	socket.emit('ping', {latency: latency.value});
	socket.emit('latency', {latency: latency.value});
}, 1000);

function loop() {
	game.update();
	spawnBall();
	playerCollision();
	if (checkGoal())
	{
		socket.emit('score');
		if (game.player.score === game.options?.winScore)
			socket.emit('endGame')
	}
	socket.emit('updatePlayerPos', {pos: game.player.racket.y});
	requestAnimationFrame(loop);
}

onBeforeMount(() => {
	const options = localStorage.getItem('gameInfos');
	const optionsParsed = JSON.parse(options);

	game.options = optionsParsed.options;
	game.player.side = optionsParsed.side;
	game.score = optionsParsed.side;
	if (game.player.side !== null)
		game.player.racket = new Racket(game.player.side, 2000, 2000 / (4/3));

	game.opponent.side = !game.player.side;
	game.opponent.racket = new Racket(game.opponent.side, 2000, 2000 / (4/3));

	axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/pseudo`, { withCredentials: true }).then(res => {
				name = res.data;
				socket.emit('updateSocket', {name: name });
			});

	socket.on('updateOpponent', (infos: any) => {
		game.opponent.racket.y = infos.pos;
	});

	socket.on('pong', () => {
		latency.value = Math.round((performance.now() - ping) / 2);
	});

	socket.on('opponentLatency', (info) => {
		opponentLatency.value = info.latency;
	});

	socket.on('spawnBall', (infos) => {
		game.isWaiting = false;
		game.ball.spawn(infos.x, infos.y, infos.direction, game.options.ballSpeed);
		game.ball.move(latency.value / 1000 + opponentLatency.value / 1000);
	});

	socket.on('opponentScore', () => {
		game.isWaiting = true;
		game.waiting_timer = performance.now();
		game.opponent.score++;
		game.ball.x = -200;
	});

	socket.on('ballBounce', (infos) => {
		game.ball.x = infos.x;
		game.ball.y = infos.y;
		game.ball.currentSpeed = infos.speed;
		game.ball.direction = infos.direction;
		game.ball.move(latency.value / 1000 + opponentLatency.value / 1000);
	});
})

onMounted(() => {
		launch();
	});


</script>

<style scoped>

#waiting-text
{
	font-size: 4em;
	color: var(--plight);
	margin-top: 1em;
}

p {
	color: aliceblue;
}

.page-background
{
	z-index: -1;
}

canvas {
	background-color: black;
	width: 60%;
}

</style>
