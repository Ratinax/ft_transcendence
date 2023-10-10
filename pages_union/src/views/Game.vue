<template>
	<div>
		<div v-if="start">
			<canvas></canvas>
		</div>
		<div v-else>
			<button @click="startGame">start</button>
			<button @click="quickPlay(1)">slow</button>
			<button @click="quickPlay(2)">classic</button>
			<button @click="quickPlay(3)">fast</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { Ball } from "../assets/game/ball";
import { Game, gameOptions } from "../assets/game/game";
import { Player } from "../assets/game/player";
import { Racket } from "../assets/game/racket";
import { io } from 'socket.io-client';

const	socket = io(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}`);

const	start = ref(false);
const	name = ref('hit');

const	game = new Game();

game.player = new Player();
game.opponent = new Player();

game.ball = new Ball();

window.addEventListener('keydown', e => {
		if (e.key === "w")
			game.up = true;
		if (e.key === "s")
			game.down = true;
	})

	window.addEventListener('keyup', e => {
		if (e.key === "w")
			game.up = false;
		if (e.key === "s")
			game.down = false;
	});

async function initGame() {
	start.value = true;
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

function startGame() {
	initGame().then(
		() => {
			launch();
		}
	)
}

function loop() {
	game.update();
	socket.emit('state', {pos: game.player.racket?.y})
	requestAnimationFrame(loop);
}

function quickPlay(mode: number) {
	console.log(mode);
	socket.emit('quickPlay', {name: name.value, mode: mode});
}

// function joinGame() {
// 	socket.emit('joinGame', {name: name, creatorId: 1});
// }

// function update() {
// 	socket.emit('update', {y: game.player?.racket?.y})
// }

// function createGame() {
// 	socket.emit('createGame', {options: 1, name: name});
// }

// function deleteGame() {
// 	socket.emit('deleteGame');
// }

onBeforeMount(() => {
	socket.on('join', (infos: any) => {
		game.options = infos.options;
		game.player.side = infos.side;
		game.player.name = name.value;
		if (game.player.side !== null)
			game.player.racket = new Racket(game.player.side, 2000, 2000 / (4/3));
	});

	socket.on('full', (infos: any) => {
		game.opponent.name = infos.opponentName;
		game.opponent.side = infos.opponentSide;

		console.log(infos);

		if (game.opponent.side !== null)
			game.opponent.racket = new Racket(game.opponent.side, 2000, 2000 / (4/3));

		initGame().then(
		() => {
			launch();
		})
	});

	socket.on('update', (updateInfos: any) => {
		game.ball.currentSpeed = updateInfos.update.ballSpeed;
		game.ball.direction = updateInfos.update.ballDir;
		//if (game.ball.x >= updateInfos.update.ballX + 10 || game.ball.x <= updateInfos.update.ballX - 10)
		game.ball.x = updateInfos.update.ballX;
		//if (game.ball.y >= updateInfos.update.ballY + 10 || game.ball.y <= updateInfos.update.ballY - 10)
		game.ball.y = updateInfos.update.ballY;
		if (updateInfos.update.player1Side === game.player.side) {
			game.player.score = updateInfos.update.player1Score;
			game.opponent.score = updateInfos.update.player2Score;
			if (game.player.racket)// && (game.player.racket.y >= updateInfos.update.player1Pos + 10 || game.player.racket.y <= updateInfos.update.player1Pos - 10))
				game.player.racket.y = updateInfos.update.player1Pos;
			if (game.opponent.racket)// && (game.opponent.racket.y >= updateInfos.update.player2Pos + 10 || game.opponent.racket.y <= updateInfos.update.player2Pos - 10))
				game.opponent.racket.y = updateInfos.update.player2Pos;
		}
		else {
			game.player.score = updateInfos.update.player2Score;
			game.opponent.score = updateInfos.update.player1Score;
			if (game.player.racket)// && (game.player.racket.y >= updateInfos.update.player2Pos + 10 || game.player.racket.y <= updateInfos.update.player2Pos - 10))
				game.player.racket.y = updateInfos.update.player2Pos;
			if (game.opponent.racket)// && (game.opponent.racket.y >= updateInfos.update.player1Pos + 10 || game.opponent.racket.y <= updateInfos.update.player1Pos - 10))
				game.opponent.racket.y = updateInfos.update.player1Pos;
		}
	});
})


</script>

<style>
canvas {
	background-color: black;
	width: 60%;
}
</style>
