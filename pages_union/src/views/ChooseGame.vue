<template>
    <Menu />
	<div class="page-background"></div>
	<div class="choose-game-container view">
        <div class="game-mode" v-for="gameMode in gameModes" :key="gameMode.name" @click="launchGame(gameMode)">
            <img :src="getImageURL(gameMode .img)"/>
            <p>{{gameMode.name}}</p>
        </div>
	</div>
</template>


<script lang="ts">

import Menu from '@/components/Menu.vue';
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
	name: 'ChooseGame',
	components:
	{
        Menu
    },
	data() {
		return {
            sessionCookie: '',
            gameModes: [{name: 'Long ring long land', ballAccel: 5, ballSize: 50, ballSpeed: 700, maxAngle: 20, playerSize: 400, playerSpeed: 700, winScore: 5, img: 'sleep.png'},
                        {name: 'INCREASE', ballAccel: 500, ballSize: 50, ballSpeed: 1200, maxAngle: 45, playerSize: 400, playerSpeed: 1700, winScore: 5, img: 'increase.png'},
                        {name: 'Classic', ballAccel: 50, ballSize: 30, ballSpeed: 1200, maxAngle: 45, playerSize: 300, playerSpeed: 1700, winScore: 7, img: 'classic.png'},
                        {name: 'Too fast for y\'all', ballAccel: 50, ballSize: 15, ballSpeed: 600, maxAngle: 45, playerSize: 200, playerSpeed: 3700, winScore: 5, img: 'fast.png'},
                        {name: '#*$@*#§?!!', ballAccel: 300, ballSize: 25, ballSpeed: 1500, maxAngle: 75, playerSize: 200, playerSpeed: 2700, winScore: 10, img: 'wtf.png'}]
		}
	},
	async mounted() {
        this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
	},
	methods:
	{
		getImageURL(img: string)
        {
            return (`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/images/${img}`);
        },
        launchGame(gameMode: {name: string, ballAccel: number, ballSize: number, ballSpeed: number, maxAngle: number, playerSize: number, playerSpeed: number, winScore: number })
        {
            console.log(gameMode.name)
        }
	}
});

</script>

<style scoped>
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
</style>

