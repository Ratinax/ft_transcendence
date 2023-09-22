<template>
	<div @click.self="close" class="modal-overlay" v-if="show">
		<div class="modal">
			<form class="input-container" @submit.prevent="joinAChannel">
				<input v-model="channelName" placeholder="Channel name"/>
				<input v-model="password" placeholder="Password (Optionnal)" type="password"/>
				<p v-if="matrixIndex > 0" class="error">{{ matrixError[matrixIndex] }}</p>
				<div class="buttons">
					<button class="ft-button" type="submit">Join</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'JoinChannel',
	props: {
		show: Boolean,
		socket: Socket,
		sessionCookie: String,
	},
	data()
	{
		return {
			channelName: '',
			password: '',
			matrixError: [
				'allright',
				'You must enter a channel name',
				'No such channel',
				'You are alrady in that channel',
				'Wrong password',
				'You are banned from this channel',
				'This channel is in private mode',
			],
			matrixIndex: 0,
		}
	},
	mounted()
	{
		if (this.socket)
		{
			this.socket.on('joinNoSuchChannel', async (response: {sessionCookie: string}) => {
				if (response.sessionCookie === this.sessionCookie)
				this.noSuchChannel();
		});
		this.socket.on('joinAlreadyIn', async (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.alreadyIn();
		});
		this.socket.on('joinWrongPassword', async (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.wrongPassword();
		});
		this.socket.on('joinGoodRequest', async (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
				this.goodRequest();
		});
		this.socket.on('joinBanned', async (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.joinBanned();
		});
		this.socket.on('joinPrivateMode', async (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.privateMode();
		});
	}
},
methods: 
	{
		async joinAChannel()
		{
			this.matrixIndex = 0;
			if (this.channelName === '')
			{
				this.matrixIndex = 1;
				return ;
			}
			if (this.socket)
				this.socket.emit('joinChannel', {channelName: this.channelName, password: this.password, sessionCookie: this.sessionCookie})
		},
		close()
		{
			this.resetData();
			this.$emit('close');
		},
		resetData()
		{
			this.channelName = '';
			this.password = '';
			this.matrixIndex = 0;
		},
		noSuchChannel()
		{
			this.matrixIndex = 2;
		},
		alreadyIn()
		{
			this.matrixIndex = 3;
		},
		wrongPassword()
		{
			this.matrixIndex = 4;
		},
		joinBanned()
		{
			this.matrixIndex = 5;
		},
		goodRequest()
		{
			this.close();
		},
		privateMode()
		{
			this.matrixIndex = 6;
		}
	},
});
</script>

<style scoped src="../../assets/popup.css">

</style>

