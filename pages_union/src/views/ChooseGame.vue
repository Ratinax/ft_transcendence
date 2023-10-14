<template>
	<Menu />
	<div class="page-background"></div>
	<div class="view col choose-game-container">
		<div v-if="!isSearching" class="col content">
			<div class="game-mode" v-for="gameMode in gameModes" :key="gameMode.name" @click="launchGame(gameMode)">
				<img :src="getImageURL(gameMode .img)"/>
				<p>{{gameMode.name}}</p>
			</div>
		</div>
		<div v-else class="col content">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" class="svg-wrap">
				<circle r="15" cx="50" cy="25" class="svg-stroke" stroke-linecap="round"></circle>
			</svg>
			<p id="waiting-text">Waiting for players</p>
			<form @submit.prevent="cancel">
				<button class="ft-button red-button" type="submit">Cancel</button>
			</form>
		</div>
	</div>
</template>


<script lang="ts">

import Menu from '@/components/Menu.vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
	name: 'ChooseGame',
	components:
	{
		Menu
	},
	data() {
		return {
			isSearching: false,
			socket: io(`http://${process.env.VUE_APP_IP}:3004/`),
			sessionCookie: '',
			router: useRouter(),
			gameModes: [{name: 'Long ring long land', ballAccel: 5, ballSize: 50, ballSpeed: 700, maxAngle: 20, playerSize: 400, playerSpeed: 700, winScore: 5, img: 'sleep.png'},
				{name: 'INCREASE', ballAccel: 500, ballSize: 50, ballSpeed: 1200, maxAngle: 45, playerSize: 400, playerSpeed: 1700, winScore: 5, img: 'increase.png'},
				{name: 'Classic', ballAccel: 50, ballSize: 30, ballSpeed: 1200, maxAngle: 45, playerSize: 300, playerSpeed: 1700, winScore: 7, img: 'classic.png'},
				{name: 'Too fast for y\'all', ballAccel: 50, ballSize: 15, ballSpeed: 600, maxAngle: 45, playerSize: 200, playerSpeed: 3700, winScore: 5, img: 'fast.png'},
				{name: '#*$@*#§?!!', ballAccel: 300, ballSize: 25, ballSpeed: 1500, maxAngle: 75, playerSize: 200, playerSpeed: 2700, winScore: 10, img: 'wtf.png'}]
		}
	},
	async mounted() {
		this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
		this.socket.on('joinGame', (infos: any) => {
			localStorage.setItem('gameInfos', JSON.stringify({options: infos.options, side: infos.side}));
		});
		this.socket.on('full', (infos: any) => {
			this.router.push('/game');
			localStorage.setItem('opponentInfos', JSON.stringify({side: infos.opponentSide}));

		});
	},
	methods:
	{
		getImageURL(img: string)
		{
			return (`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/images/${img}`);
		},
		launchGame(gameMode: {name: string, ballAccel: number, ballSize: number, ballSpeed: number, maxAngle: number, playerSize: number, playerSpeed: number, winScore: number })
		{
			this.isSearching = true;
			axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true }).then(res => {
				this.socket.emit('quickPlay', {mode: 1, name: 'onsenfou', sessionKey: res.data});
			})
		},
		cancel()
		{
			this.isSearching = false;
		}
	}
});

</script>

<style scoped>

.choose-game-container
{
	height: 100vh;
	justify-content: center;
}

.content {
	align-items: center;
	max-width: 1260px;
	width: 70%;
	transition: width 200ms ease;
	margin: auto;
}

.game-mode
{
	margin: .42em;
	border-radius: 1em;
	width: 100%;
	font-size: 1.42em;
	box-shadow: 0px 2px 2px var(--plight);
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 200ms ease;
	overflow: hidden;
}

.game-mode:hover {
	box-shadow: 0 2px 2px var(--pblue);
}

.game-mode img {
	transition: all 200ms ease;
}

.game-mode:hover img
{
	opacity: 0.5;
	filter: blur(0);
}

.game-mode p {
	transition: all 200ms ease;
}

.game-mode:hover p {
	transform: scale(110%);
	color: var(--pcyan);
}

.game-mode img {
	width: 100%;
	opacity: 0.3;
	filter: blur(.15em);
	width: fit-content;
	height: 4em;
}

.game-mode p {
	position: absolute;
}

.ft-button
{
	margin-top: 2em;
}

/* canvas { */
/* 	background-color: black; */
/* 	width: 60%; */
/* } */

.svg-wrap {
	animation: rotate 2s linear infinite;
	width: 7em;
	height: 7em;
	border-radius: 50%;
	scale: 2;
}

.svg-stroke {
	fill: transparent;
	stroke-dasharray: 46.82, 93.64;
	stroke-dashoffset: 46.82;
	stroke: white;
	stroke-width: 0.1em;
	opacity: 1;
}

.svg-wrap .svg-stroke {
	animation: stroke-end 2s 0.5s linear infinite;
}

#waiting-text {
	font-size: 2.42em;
	width: 100%;
	text-align: center;
	color: var(--plight);
	margin-top: 1em;
}

.content p {
	color: var(--plight);
}

.page-background {
	z-index: -1;
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}


@keyframes stroke-end {
50% {
	stroke-dasharray: 46.82, 93.64;
	stroke-dashoffset: 0;
}

100% {
	stroke-dasharray: 0, 93.64;
	stroke-dashoffset: -93.64;
}
}

@keyframes rotate {
0% {
	transform: rotate(0deg);
}

100% {
	transform: rotate(360deg);
}
}

@media only screen and (max-width: 800px) {
	.content {
		width: 90%;
	}
}

</style>
