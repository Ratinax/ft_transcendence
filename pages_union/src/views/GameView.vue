<template>
	<div class="page-background"></div>
	<div class="container">
		<div>
			<div>
				<canvas></canvas>
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

const	socket = io(`http://${process.env.VUE_APP_IP}:3004/`)
console.log(socket)

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

	console.log('je vais dans launch');
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

function loop() {
	game.update();
	socket.emit('state', {pos: game.player.racket?.y})
	requestAnimationFrame(loop);
}

onBeforeMount(() => {
	let options = localStorage.getItem('gameInfos');
	if (!options)
		options = '';
	const optionsParsed = JSON.parse(options);
	game.options = optionsParsed.options;
	game.player.side = optionsParsed.side;
	if (game.player.side !== null)
		game.player.racket = new Racket(game.player.side, 2000, 2000 / (4/3));
	
	let opponent = localStorage.getItem('opponentInfos');
	const opponentParsed = JSON.parse(options);

	if (!opponent)
		opponent = '';
	game.opponent.side = opponentParsed.side;
	if (game.opponent.side !== null)
		game.opponent.racket = new Racket(game.opponent.side, 2000, 2000 / (4/3));

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

	onMounted(() => {
		launch();
	})
})


</script>

<style scoped>

#waiting-text
{
	font-size: 4em;
	color: var(--plight);
	margin-top: 1em;
}
.page-background
{
	z-index: -1;
}



</style>
