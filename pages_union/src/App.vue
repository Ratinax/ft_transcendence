<template>
	<router-view></router-view>
</template>

<script>
import { io } from 'socket.io-client';
import axios from 'axios';


export default {
	name: 'App',
	components: {
	},
	data()
{
		return {
			socket: io(`http://${process.env.VUE_APP_IP}:3003/`, { withCredentials: true }),
		}
	},
	mounted()
{
		this.socket.on('pingAlive', async () => {
			await axios.post(`http://${process.env.VUE_APP_IP}:3000/sessions/pingBack`, {}, { withCredentials: true });
		})
	}
}
</script>

<style src="./assets/global.css" rel="stylesheet" lang="css"></style>

<style>
.modal
{
	background-color: var(--pdark);
	padding: 1.5em;
	border-radius: .5em;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	border: 2px solid var(--pcyan);
	width: 20%;
	max-width: 250px;
}

.modal-overlay 
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

</style>
