<template>
	<div class="row send-message" v-if="showContent">
		<form @submit.prevent="sendMessage">
			<input class="message-input" v-model="messageText" placeholder="Send a message..." v-if="!isUserTimeout"/>
			<!-- <input v-model="messageText" class="input-error" :placeholder="'You cannot send messages because you are timeout for ' + durationTimeoutString" v-else/> -->
		</form>
		<form @submit.prevent="inviteInGame">
			<button class="ft-button" type="submit">Invite in game</button>
		</form>
	</div>
</template>

<script>
import { Socket } from 'socket.io-client';


export default {
	name: 'SendMessage',
	props: 
	{
		showContent: Boolean,
		socket: Socket,
		channelId: Number,
	},
	data()
{
		return {
			messageText: '',
			isUserTimeout: false,
			durationTimeoutString: String,
		}
	},
	methods:
	{
		getCurrentDate() 
		{
			const currentDate = new Date();
			const year = currentDate.getFullYear();
			const month = String(currentDate.getMonth() + 1).padStart(2, '0');
			const day = String(currentDate.getDate()).padStart(2, '0');
			const hours = String(currentDate.getHours()).padStart(2, '0');
			const minutes = String(currentDate.getMinutes()).padStart(2, '0');
			const seconds = String(currentDate.getSeconds()).padStart(2, '0');

			const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

			return formattedDate;
		},
		async sendMessage()
		{
			if (this.messageText === '')
			return ;
			this.$emit('create-message', {
				channel_id: this.channelId,
				message: this.messageText,
				dateSent: this.getCurrentDate(),
				isAGameInvite: false,
			})
			this.messageText = '';
		},
		timeout(duration)
		{
			this.isUserTimeout = true;
			const days = Math.floor(duration / 86400);
			duration -= days * 86400;
			const hours = Math.floor(duration / 3600);
			duration -= hours * 3600;
			const minutes = Math.floor(duration / 60);
			duration -= minutes * 60;
			const seconds = Math.floor(duration);
			this.durationTimeoutString = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		},
		goodRequest()
		{
			this.durationTimeoutString = '';
			this.isUserTimeout = false;
		},
		inviteInGame()
		{
			this.$emit('create-message', {
				channel_id: this.channelId,
				message: '',
				dateSent: this.getCurrentDate(),
				isAGameInvite: true,
			})
		},
	}

}
</script>

<style scoped>

.send-message
{
	border-top: 1px solid var(--plight);
	align-items: center;
	justify-content: space-evenly;
	height: 7%;
}

.message-input {
	font-size: 1em;
	padding: .8em;
	border-radius: .5em;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	width: 28em;
}

button {
	font-size: 1.1em;
	background: var(--pcyan);
	box-shadow: 0 4px 0 var(--pblue);
	margin-bottom: 2px;
}

</style>
