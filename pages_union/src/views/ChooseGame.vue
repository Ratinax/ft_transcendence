<template>
    <div class="page-background"></div>
    <div v-if="!isSearching">
        <Menu />
        <div class="choose-game-container view">
            <div class="game-mode" v-for="gameMode in gameModes" :key="gameMode.name" @click="launchGame(gameMode)">
                <img :src="getImageURL(gameMode .img)"/>
                <p>{{gameMode.name}}</p>
            </div>
        </div>
    </div>
    <div v-else class="load-container">
        <div class="loader">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" class="svg-wrap">
                <circle r="15" cx="50" cy="25" class="svg-stroke" stroke-linecap="round"></circle>
            </svg>
        </div>
        <p id="waiting-text">Waiting for players</p>
        <form class="buttons" @submit.prevent="cancel">
            <button class="ft-button red-button" type="submit">Cancel</button>
        </form>
    </div>
</template>


<script lang="ts">

import Menu from '@/components/Menu.vue';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
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
            console.log('ca a join', infos);
            localStorage.setItem('gameInfos', JSON.stringify({options: infos.options, side: infos.side}));
        });
        this.socket.on('full', (infos: any) => {
            console.log('c est full');
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
.ft-button
{
	margin-top: 2em;
}
.load-container
{
	display: flex;
	align-items: center;
	flex-direction: column;
    padding: 20em;
}
.container
{
	display: flex;
	justify-content: center;
	padding-top: 20em;
}
canvas {
	background-color: black;
	width: 60%;
}
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  scale: 4;
}

.svg-wrap {
  animation: rotate 2s linear infinite;
  width: 7em;
  height: 7em;
  border-radius: 50%;
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

img{
    position: absolute;
    opacity: 0.3;
    filter: blur(.15em);
    width: 100%;
    height: 4em;
}
.game-mode
{
    width: 100%;
    height: 4em;
    font-size: 1.5em;
    border: .1em solid white;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
    cursor: pointer;
    transition: opacity 0.3s;
}
.game-mode:hover
{
    opacity: 1;
}
#waiting-text
{
	font-size: 4em;
	color: var(--plight);
	margin-top: 1em;
}
p
{
	color: var(--plight);
}
.page-background {
    z-index: -1;
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}

.choose-game-container
{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
</style>

