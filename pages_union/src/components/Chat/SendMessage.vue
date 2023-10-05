<template>
	<div class="row send-message" v-if="showContent">
		<form @submit.prevent="sendMessage">
			<input v-model="messageText" class="message-input-error message-input" :placeholder="'You are timeout for ' + durationTimeoutString" v-if="isUserTimeout"/>
			<input class="message-input-error message-input" v-model="messageText" placeholder="One of you block the other one" v-else-if="isBlockedBy"/>
			<input class="message-input" v-model="messageText" placeholder="Send a message..." v-else/>
		</form>
		<form @submit.prevent="inviteInGame">
			<button class="ft-button" type="submit">Invite in game</button>
		</form>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SendMessage',
	props: 
	{
		showContent: Boolean,
		socket: Socket,
		channelId: Number,
		sessionCookie: String,
	},
	data()
	{
		return {
			messageText: '',
			isUserTimeout: false,
			durationTimeoutString: '',
			isBlockedBy: false,
		}
	},
	mounted()
	{
		this.socket?.on('sendMessageBlocked', (response: any) => {
			if (this.sessionCookie === response.sessionCookie)
				this.isBlockedBy = true;
		})
		this.socket?.on('sendMessageTimeout', async (response: {duration: number, sessionCookie: string}) => {
			if (this.sessionCookie === response.sessionCookie)
				this.timeout(response.duration);
		});
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
			this.socket?.emit('createMessage', { channel_id: this.channelId,
				message: this.messageText,
				dateSent: this.getCurrentDate(),
				isAGameInvite: false, sessionCookie: this.sessionCookie });
			this.messageText = '';
		},
		timeout(duration: number)
		{
			this.isUserTimeout = true;
			const days = Math.floor(duration / 86400);
			duration -= days * 86400;
			const hours = Math.floor(duration / 3600);
			duration -= hours * 3600;
			const minutes = Math.floor(duration / 60);
			duration -= minutes * 60;
			const seconds = Math.floor(duration);
			this.durationTimeoutString = `${days} d, ${hours} h, ${minutes} min and ${seconds} sec`;
		},
		refreshBar()
		{
			this.durationTimeoutString = '';
			this.isUserTimeout = false;
			this.isBlockedBy = false;
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
});
</script>

<style scoped>

.send-message
{
	top: 0;
	bottom: 0;
	border-top: 1px solid var(--plight);
	align-items: center;
	justify-content: space-evenly;
	overflow: auto;
}

.message-input {
	font-size: 1em;
	padding: .8em;
	border-radius: .5em;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	width: 24em;
	top:0;
	bottom:0;
	left:0;
	right: 0;
}
.message-input-error::placeholder
{
	color: red;
}

button {
	font-size: 1.1em;
	background: var(--pcyan);
	box-shadow: 0 4px 0 var(--pblue);
	margin-bottom: 2px;
}

</style>
