<template>
	<div>
		<div class="page-background"></div>
		<div class="gameview-container col">
			<div class="row users-infos">
				<div class="row left user-info">
					<div v-if="game.player.side" class="profile-pic-container">
						<img :src="playerProfilePic" alt="player profile picture">
					</div>
					<div v-else class="profile-pic-container">
						<img :src="opponentProfilePic" alt="opponent profile picture">
					</div>
					<div class="col">
						<span v-if="game.player.side">{{ nickname }}</span>
						<span v-else>{{ opponentName }}</span>
						<span v-if="game.player.side" class="latency">{{ latency }}ms</span>
						<span v-else class="latency">{{ opponentLatency }}ms</span>
					</div>
				</div>
				<div class="row right user-info">
					<div class="col">
						<span v-if="!game.player.side">{{ nickname }}</span>
						<span v-else>{{ opponentName }}</span>
						<span v-if="!game.player.side" class="latency" style="text-align: right;">{{ latency }}ms</span>
						<span v-else class="latency">{{ opponentLatency }}ms</span>
					</div>
					<div v-if="!game.player.side" class="profile-pic-container">
						<img :src="playerProfilePic" alt="player profile picture">
					</div>
					<div v-else class="profile-pic-container">
						<img :src="opponentProfilePic" alt="opponent profile picture">
					</div>
				</div>
			</div>
			<canvas></canvas>
			<div class="gameview-button-zone">
				<button @mousedown="goDown" @mouseup="stopDown" @touchend="stopDown" @touchstart="goDown" class="ft-button blue-button downButton">
					<font-awesome-icon icon="fa-solid fa-down-long" size="xl"/>
				</button>
				<button @mousedown="goUp" @mouseup="stopUp" @touchend="stopUp" @touchstart="goUp" class="ft-button blue-button upButton">
					<font-awesome-icon icon="fa-solid fa-up-long" size="xl"/>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import { Ball } from "../assets/game/ball";
import { Game} from "../assets/game/game";
import { Player } from "../assets/game/player";
import { Racket } from "../assets/game/racket";
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRouter } from 'vue-router';

const	socket = io(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/game`);
const	router = useRouter();

let		playerName = ref('');
let		nickname = ref('');
let		playerProfilePic = ref('');
let		opponentName = ref('');
let		opponentProfilePic = ref('');
let		exit = false;
const	game = new Game();

const	latency = ref(0);
const	opponentLatency = ref(0);
let		ping = 0;

game.player = new Player();
game.opponent = new Player();

game.ball = new Ball();

window.addEventListener('keydown', e => {
	if (e.key === "w" || e.key === "Z" || e.key === "z" || e.key === "W")
	{
		game.up = true;
		if (!game.down)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 1});
		else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
	}
	if (e.key === "s" || e.key === "S")
	{
		game.down = true;
		if (!game.up)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: -1});
		else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
	}
})

window.addEventListener('keyup', e => {
	if (e.key === "w" || e.key === "Z" || e.key === "z" || e.key === "W")
	{
		game.up = false;
		if (game.down)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: -1});
		else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
	}
	if (e.key === "s" || e.key === "S")
	{
		game.down = false;
		if (game.up)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 1});
		else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
	}
});

function spawnBall() {
	if (game.isWaiting && performance.now() >= game.waiting_timer + game.spawnTime)
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
		hitModulo = (game.ball.y - game.player.racket?.y + game.options.playerSize / 2) / game.options.playerSize * 2 - 1;
		if (hitModulo > 1)
		hitModulo = 1;
		else if (hitModulo < -1)
		hitModulo = -1;
		game.ball.direction = hitModulo * game.options.maxAngle;
		if (game.player.side === false)
		game.ball.direction = 180 - game.ball.direction;
		game.ball.currentSpeed += game.options.ballAccel;
		if (game.ball.currentSpeed > 3200)
			game.ball.currentSpeed = 3200;
		socket.emit('bounce', {x: game.player.racket?.x, y: game.ball.y, direction: game.ball.direction, speed: game.ball.currentSpeed});
		return true;
	}
	return false;
}

function checkGoal() {
	const goal = game.ball.score(game.width, game.options?.ballSize);
	if (goal)
	{
		if (goal === 2 && !game.isWaiting && game.player.side === true)
		{
			game.opponent.score++;
			game.ball.x = -200;
			game.ball.y = -200;
			game.isWaiting = true;
			game.waiting_timer = performance.now();
			game.dir = 1;
			game.score = true;
			return true;
		}
		else if (goal === 1 && !game.isWaiting && game.player.side === false)
		{
			game.opponent.score++;
			game.ball.x = -200;
			game.ball.y = -200;
			game.isWaiting = true;
			game.waiting_timer = performance.now();
			game.dir = 0;
			game.score = true;
			return true;
		}
	}
	return false;
}

async function getOptions() {
	const pseudo = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/pseudo`, { withCredentials: true })
	const nicknameTmp = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/nickname`, { withCredentials: true })
	playerName.value = pseudo.data;
	nickname.value = nicknameTmp.data;
	const res = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/games/gameOptions/${playerName.value}`, { withCredentials: true });

	if (!res.data.inGame)
	{
		exit = true;
		router.replace('/choose_game');
	}
	else
	{
		game.options = res.data.options;
		game.player.side = res.data.side;
		game.score = res.data.side;
		if (game.player.side !== null)
			game.player.racket = new Racket(game.player.side, 2000, 2000 / (4/3));
		game.opponent.side = !game.player.side;
		game.opponent.racket = new Racket(game.opponent.side, 2000, 2000 / (4/3));
		opponentName.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/nickname/${res.data.opponentName}`, { withCredentials: true })).data;

		axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/imageNameByPseudo/${playerName.value}`, {withCredentials: true}).then((res) => {
			playerProfilePic.value = res.data;
		});
		axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/imageNameByPseudo/${res.data.opponentName}`, {withCredentials: true}).then((res) => {
			opponentProfilePic.value = res.data;
		});
	}
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
	socket.emit('ping');
	socket.emit('latency', {latency: latency.value});
}, 100);

setInterval(() => {
	socket.emit('imInGame');
}, 1000);

function loop() {
	game.update();
	spawnBall();
	if (!playerCollision() && checkGoal())
	{
		socket.emit('score');
		if (game.opponent.score === game.options?.winScore)
		socket.emit('endGame')
	}
	if (game.isOver)
	{
		game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
		let	winnerName = "";
		if (game.player.score > game.opponent.score)
			winnerName = nickname.value;
		else
			winnerName = opponentName.value;
		const	scoreStr = `${nickname.value} ${game.player.score} - ${game.opponent.score} ${opponentName.value}`
		const	winnerStr = `winner: ${winnerName}`;
		game.ctx.fillText(scoreStr, (game.canvas.width - game.ctx.measureText(scoreStr).width) / 2, game.canvas.height / 2 - 100);
		game.ctx.fillText(winnerStr, (game.canvas.width - game.ctx.measureText(winnerStr).width) / 2, game.canvas.height / 2 + 100);
		return ;
	}
	requestAnimationFrame(loop);
}

onBeforeMount(async() => {

	const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
	axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/pseudo`, { withCredentials: true }).then(res => {
		playerName.value = res.data;
	});

	socket.emit('updateSocket', {sessionKey: sessionCookie});
	socket.on('updateOpponent', (infos: any) => {
		game.opponent.racket.y = infos.pos;
		game.opponentDirection = infos.direction;
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
		game.player.score++;
		game.ball.x = -200;
	});

	socket.on('ballBounce', (infos) => {
		game.ball.x = infos.x;
		game.ball.y = infos.y;
		game.ball.currentSpeed = infos.speed;
		game.ball.direction = infos.direction;
		game.ball.move(latency.value / 1000 + opponentLatency.value / 1000);
	});

	socket.on('gameOver', () => {
		game.isOver = true;
		setTimeout(() => {
			router.replace('/choose_game');
		}, 3000);
	});

	socket.on('opponentGaveUp', (body) => {
		game.player.score = body.score;
		socket.emit('endGame');
	});

	socket.on('isInGame', (body) => {
		if (!body.isInGame && !game.isOver) {
			router.replace('/choose_game');
		}
	})

})

onMounted(() => {
	getOptions().then(() => {
		if (!exit)
			launch();
	})
});

onBeforeUnmount(() => {
	socket.close();
})

function goUp () {
	game.up = true;
	if (!game.down)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 1});
	else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
}

function goDown () {
	game.down = true;
	if (!game.up)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: -1});
	else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
}

function stopUp () {
	game.up = false;
	if (game.down)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: -1});
	else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
}

function stopDown () {
	game.down = false;
	if (game.up)
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 1});
	else
		socket.emit('updatePlayerPos', {pos: game.player.racket?.y, direction: 0});
}

</script>

<style scoped>

#waiting-text
{
	font-size: 4em;
	color: var(--plight);
	margin-top: 1em;
}

.gameview-container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 5em;
}

.users-infos {
	width: 60%;
}

.user-info {
	display: flex;
	align-items: center;
}

canvas {
	background-color: black;
	border-radius: 1em;
	width: 60%;
}

.profile-pic-container {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	width: 5em;
	height: 5em;
	margin: .42em 0; 
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
	transition: all 200ms ease;
}

.users-infos {
	color: var(--pblue);
	font-size: 1.1em;
}

.left {
	margin-right: auto;
}

.right {
	margin-left: auto;
}

.right div[class="col"] {
	margin-right: 1em;
}

.left div[class="col"] {
	margin-left: 1em;
}

.latency {
	font-size: .8em;
	color: var(--plight);
}

.gameview-button-zone {
	margin-top: 3em;
	width: 100%;
	display: flex;
	justify-content: space-around;
}

button {
	color: var(--pdark);
}

@media only screen and (max-width: 1200px) {
	canvas, .users-infos {
		width: 50%;
	}
}

@media only screen and (max-width: 600px) {
	.profile-pic-container {
		width: 2.5em;
		height: 2.5em;
	}

	canvas, .users-infos {
		width: 90%;
	}
}

@media only screen and (min-width: 500px) {
	.gameview-button-zone {
		display: none;
	}

	.gameview-container {
		padding-top: 0;
	}
}

</style>
