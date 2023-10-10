<template>
	<!-- <div class="chat">
		<div v-if="!joined">
			<form @submit.prevent="join">
				<label>What's your name ?</label>
				<br>
				<input v-model="name">
				<button type="submit">Send</button>
			</form>
		</div>
		<div v-else class="chat-container">
			<div>Welcome {{name}}</div>
			<div class="messages-container">
				<div v-if="!messages[0]">
					There is nothing here ...
				</div>
				<div v-else v-for="message in messages" :key="message.id">
					[{{message.name}}]: {{message.text}}
				</div>
			</div>

			<div v-if="typingDisplay">{{typingDisplay}}</div>

			<div class="message-input">
				<form @submit.prevent="sendMessage">
				<label>Message: </label>
				<input v-model="messageText" @input="emitTyping">
				<button type="submit">Send</button>
			</form>
			</div>
		</div>
	</div> -->
	<div>
		<div v-if="start">
			<canvas></canvas>
		</div>
		<div v-else>
			<form @submit.prevent="join">
				<label>What's your name ?</label>
				<br>
				<input v-model="name">
			</form>
			<button @click="startGame">start</button>
			<button @click="quickPlay(1)">slow</button>
			<button @click="quickPlay(2)">classic</button>
			<button @click="quickPlay(3)">fast</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { Ball } from "@/game/ball";
import { Game, gameOptions } from "@/game/game";
import { Player } from "@/game/player";
import { Racket } from "@/game/racket";
import { io } from 'socket.io-client';

const	socket = io("http://10.19.250.41:3000");

const	start = ref(false);
const	name = ref('');

const	game = new Game();

const	options: gameOptions = {
		ballAccel: 50,
		ballSize: 30,
		ballSpeed: 1200,
		maxAngle: 45,
		playerSize: 300,
		playerSpeed: 1700,
		winScore: 5,
	}

game.options = options;

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
	console.log(name.value);
	console.log(mode);
	socket.emit('quickPlay', {name: name.value, mode: mode});
}

function joinGame() {
	socket.emit('joinGame', {name: name, creatorId: 1});
}

function update() {
	socket.emit('update', {y: game.player?.racket?.y})
}

function createGame() {
	socket.emit('createGame', {options: 1, name: name});
}

function deleteGame() {
	socket.emit('deleteGame');
}

onBeforeMount(() => {
	socket.on('join', (infos) => {
		game.options = infos.options;
		game.player.side = infos.side;
		game.player.name = name.value;

		console.log(infos);

		if (game.player.side !== null)
			game.player.racket = new Racket(game.player.side, 2000, 2000 / (4/3));
	});

	socket.on('full', (infos) => {
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

	socket.on('update', (updateInfos) => {
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

onMounted(() => {
	// const	canvas = document.querySelector('canvas');
	// const	ctx = canvas?.getContext("2d");
	// if (!canvas || !ctx)
	// 	return;

	// const	ratio = 4/3;
	// canvas.width = 2000;
	// canvas.height = canvas.width / ratio;

	// game.unitRatio = 2000 / canvas.width;

	// game.canvas = canvas;
	// game.ctx = ctx;

	// requestAnimationFrame(loop);
})

// const messages = ref<any>([]);
// const messageText = ref('');
// const joined = ref(false);
// const name = ref('');
// const typingDisplay = ref('');
// 
// onBeforeMount(() => {
	// socket.emit('findAllMessages', {}, (response: any) => {
		// messages.value = response;
	// });
// 
	// socket.on('message', (message) => {
		// messages.value.push(message);
	// })
// 
	// socket.on('typing', ({name, isTyping}) => {
		// if (isTyping)
			// typingDisplay.value = `${name} is typing...`;
		// else
			// typingDisplay.value = '';
	// })
// })
// 
// function join() {
	// socket.emit('join', {name: name.value}, () => {
		// joined.value = true;
	// })
// }
// 
	// let	timeout: any;
// function sendMessage() {
	// socket.emit('createMessage', {text: messageText.value}, () => {
		// messageText.value = "";
	// })
	// clearTimeout(timeout);
	// socket.emit('typing', {isTyping: false});
// }
// 
// function emitTyping() {
	// socket.emit('typing', {isTyping: true});
	// clearTimeout(timeout);
	// timeout = setTimeout(() => {
		// socket.emit('typing', {isTyping: false});
	// }, 5000);
// }

</script>

<style>
canvas {
	background-color: black;
	width: 60%;
}
</style>
