<template>
	<div @click.self="close" class="pop-up-overlay" v-if="show">
		<div class="pop-up">
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
import { useRouter } from 'vue-router';

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
			router: useRouter(),
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
				'Should only contains A-Z, a-z, 0-9, and \'._ -\''
			],
			matrixIndex: 0,
		}
	},
	mounted()
	{
		window.addEventListener('keydown', this.handleKeyDown);
		if (this.socket)
		{
			this.socket.on('joinNotGoodChars', () => {
				this.notGoodChars();
			});
			this.socket.on('joinNotConnected', () => {
				this.noMoreConnected();
			});
			this.socket.on('joinNoSuchChannel', () => {
				this.noSuchChannel();
			});
			this.socket.on('joinAlreadyIn', () => {
				this.alreadyIn();
			});
			this.socket.on('joinWrongPassword', () => {
				this.wrongPassword();
			});
			this.socket.on('joinGoodRequest', () => {
				this.goodRequest();
			});
			this.socket.on('joinBanned', () => {
				this.joinBanned();
			});
			this.socket.on('joinPrivateMode', () => {
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
		},
		handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				this.$emit('close');
			}
		},
		notGoodChars()
		{
			this.matrixIndex = 7;
		},
		noMoreConnected()
		{
			this.router.push('/');
		}
	},
	beforeUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}
});
</script>

<style scoped src="../../assets/popup.css">
</style>

