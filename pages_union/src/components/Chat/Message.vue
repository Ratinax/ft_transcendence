<template>
	<div class="message-container">
		<div v-if="!isAGameInvite" class="message-content" :class="{sent: isSender}">
			<p class="username" v-if="!isSender">{{ username }}</p>
			<p class="message text" :class="{sent: isSender}" >{{ content }}</p>
		</div>
		<div v-else-if="!isSender" class="invite-box">
			<p class="invite">
				<span style="color: var(--pcyan)">
					{{ username }}
				</span> sent a Pong game invite !
			</p>
			<button class="ft-button green-button" @click="joinGame">ACCEPT</button>
		</div>
		<p class="invite-text invite" v-else>
			You sent a Pong game invite, waiting for a player to join. <font-awesome-icon id="cancel-game-invite" icon="fa-solid fa-xmark" @click="removeGameInvite"/>
		</p>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';

export default defineComponent({
	name: "Message-Component",
	props: {
		username: String,
		content: String,
		isAGameInvite: Boolean,
		isSender: Boolean,
		id: Number,
		socket: Socket,
		sessionCookie: String,
	},
	methods: 
	{
		joinGame()
		{
			console.log('Feature incoming');
		},
		removeGameInvite()
		{
			this.socket?.emit('removeGameInvite', {id: this.id, sessionCookie: this.sessionCookie})		}
	}
});
</script>

<style scoped>

#cancel-game-invite
{
	cursor: pointer;
	padding: 0 .5em;
}

#cancel-game-invite:hover
{
	color: red;
}

.message-container {
	color: black;
	margin-bottom: .6em;
}

.message-content {
	margin-left: .6em;
}

.message-content.sent {
	margin-left: 0;
	margin-right: .6em;

	display: flex;
	justify-content: right;
}


.message
{
	display: inline-block;
	padding: .8em 1em;
	background: var(--pdark);
	border-radius: 1em 1em 1em 0;
	max-width: 60%;
	overflow-wrap: break-word;
}

.message.sent {
	border-radius: 1em 1em 0 1em;
	background: #2f3ef5;
}

.invite-box {
	border-radius: 1em;
	padding: 1em;
	text-align: center;
	color: white;
	background: var(--pdark);
	width: fit-content;
	margin: 0 auto;
	box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.invite-text {
	display: flex;
	justify-content: center;
	align-items: center;
	color: grey;
	text-align: center;
}

.invite {
	padding-bottom: .6em;
}

</style>
