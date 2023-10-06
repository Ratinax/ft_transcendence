<template>
	<div class="send-message-container" v-if="showContent">
		<div class="send-message-content">
			<form @submit.prevent="sendMessage">
				<input v-model="messageText" class="message-input-error message-input" :placeholder="'You are timeout for ' + durationTimeoutString" v-if="isUserTimeout"/>
				<input class="message-input-error message-input" v-model="messageText" placeholder="One of you block the other one" v-else-if="isBlockedBy"/>
				<input class="message-input" v-model="messageText" placeholder="Send a message..." v-else/>
			</form>
			<form @submit.prevent="showGameOptions = true">
				<button class="ft-button gameInviteIcon"><font-awesome-icon icon="fa-solid fa-gamepad" size='1x' /></button>
				<button class="ft-button gameInviteText" type="submit">Invite in game</button>
			</form>
		</div>
		<GameOptions :show="showGameOptions" @close="showGameOptions = false" @invite-in-game="inviteInGame"></GameOptions>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';
import GameOptions from './GameOptions.vue';

export default defineComponent({
	name: 'SendMessage',
	components:
	{
		GameOptions
	},
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
			showGameOptions: false,
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
		inviteInGame(gameSettings: {ballAccel: number,
			ballSize: number, ballSpeed: number,
			maxAngle: number,
			playerSize: number,
			playerSpeed: number,
			winScore: number})
		{
			this.socket?.emit('createMessage', { 
				channel_id: this.channelId,
				message: '',
				dateSent: this.getCurrentDate(),
				isAGameInvite: true,
				sessionCookie: this.sessionCookie,
				game: gameSettings });
			this.showGameOptions = false;
		},
	}
});
</script>

<style scoped>

.send-message-container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: .42em;
	border-top: 1px solid var(--plight);
}

.send-message-content {
	display: flex;
	justify-content: space-evenly;
	width: 100%;
}

.message-input {
	transition: width 200ms ease;
	height: 100%;
	border-radius: .5em;
	padding-left: .42em;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	width: 27em;
}
.message-input-error::placeholder
{
	color: red;
}

.gameInviteIcon {
	display: none;
}

button {
	transition: font-size 200ms ease;
	font-size: 1.1em;
	height: 100%;
	background: var(--pcyan);
	box-shadow: 0 4px 0 var(--pblue);
	margin-bottom: 2px;
}

@media screen and (max-width: 1260px) {
	.gameInviteIcon {
		display: block;
	}

	.gameInviteText {
		display: none;
	}

	.message-input {
		width: 24em;
	}
}

@media screen and (max-width: 1000px) {
	.message-input {
		width: 18em;
	}
}

</style>
