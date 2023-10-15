<template>
	<div>
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
	</div>
</template>


<script lang="ts">

import Menu from '../components/Menu.vue';
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
            gameModes: [{name: 'Long ring long land', mode: 1, img: 'sleep.png'},
                        {name: 'INCREASE', mode: 1, img: 'increase.png'},
                        {name: 'Classic', mode: 2, img: 'classic.png'},
                        {name: 'Too fast for y\'all', mode: 3, img: 'fast.png'},
                        {name: '#*$@*#§?!!', mode: 3, img: 'wtf.png'}]
		}
	},
	async mounted() {
        this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
        this.socket.on('successJoin', (infos: any) => {
            console.log('ca a join', infos);
            localStorage.setItem('gameInfos', JSON.stringify({options: infos.options, side: infos.side}));
        });
        this.socket.on('gameFull', (infos: any) => {
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
        launchGame(gameMode: {name: string, mode: number})
        {
            this.isSearching = true;
			axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/pseudo`, { withCredentials: true }).then(res => {
				this.socket.emit('quickPlay', {mode: gameMode.mode, name: res.data});
			})
        },
        cancel()
        {
            this.isSearching = false;
			this.socket.emit('cancelQuickPlay');
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

