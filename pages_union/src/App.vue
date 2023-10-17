<template>
	<router-view></router-view>
</template>

<script lang="ts">
import { io } from 'socket.io-client';
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
	name: 'App',
	components: {
	},
	data()
	{
		return {
			socket: io(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/session`, { withCredentials: true }),
		}
	},
	mounted()
	{
		this.socket.on('pingAlive', async () => {
			await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/pingBack`, {}, { withCredentials: true });
		})
	}
})
</script>

<style src="./assets/global.css" rel="stylesheet" lang="css"></style>

<style>
.pop-up
{
	background-color: var(--pdark);
	padding: 1em;
	border-radius: .5em;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	width: 30%;
	max-width: 360px;
	transition: width 200ms ease;
}

.pop-up-overlay 
{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.green
{
	color: green;
}
.red
{
	color: red;
}

@media only screen and (max-width: 800px) {
	.pop-up {
		width: 70%;
	}
}

</style>
