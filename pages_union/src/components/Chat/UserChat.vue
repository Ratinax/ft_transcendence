<template>
	<div v-if="!userInChat.isInvited">
		<div class="user-in-chat">
			<font-awesome-icon icon="fa-solid fa-circle" 
				:class="{'green': userInChat.isConnected, 'red': !userInChat.isConnected}" />
			<span id="user-pseudo" 
				:class="{'admin': userInChat.isAdmin, 
					'owner': userInChat.isOwner, 
					'selection-color' : isSelected}" 
				@click="handleUserClicked">
				{{ userInChat.pseudo }}
			</span>
		</div>
			<div v-if="isSelected" class="option-list">
				<div v-if="userInChat.id !== userInChannel.id">
					<div v-if="userInChannel.isAdmin && !userInChat.isOwner">
						<p class="options" @click="kick">Kick</p> 
						<p class="options" @click="ban">Ban</p>
						<p class="options" @click="showTimeOut = true">Time out</p>
					</div>
					<div v-if="userInChannel.isOwner">
						<div v-if="!userInChat.isAdmin">
							<p class="options" @click="setAdmin">Set Admin</p>
						</div>
						<div v-if="userInChat.isAdmin">
							<p class="options" @click="removeAdmin">Remove Admin</p>
						</div>
					</div>
				</div>
				<p class="options">
					See Profile
				</p>
			</div>
		<TimeOut 
			ref="timeout"
			:show="showTimeOut" 
			@timeout-user="onTimeoutUser" 
			@close="closeTimeOut"/>
	</div>
</template>

<script>
import { Socket } from 'socket.io-client';
import TimeOut from './TimeOut.vue';

export default {
	name: 'UserChat-Component',
	components:
	{
		TimeOut,
	},
	props: 
	{
		userInChannel: Object, // the user on the website with id, isAdmin, isOwner 
		userInChat: Object, // the other user in the chat 
		isSelected: Boolean,
		socket: Socket,
		channel: Object,
		sessionCookie: String,
	},
	data()
{
		return {
			showTimeOut: false,
		}
	},
	mounted()
{
		this.socket.on('timeoutGoodRequest', async (response) => {
			if (response.channel.channel_id === this.channel.channel_id && this.sessionCookie === response.sessionCookie)
			{
				if (this.$refs.timeout)
				this.$refs.timeout.goodRequest();
			}
		});
		this.socket.on('timeoutWrongAmount', async (response) => {
			if (response.channel.channel_id === this.channel.channel_id && this.sessionCookie === response.sessionCookie)
			{
				if (this.$refs.timeout)
				this.$refs.timeout.notGoodAmount();
			}
		});
	},
	methods: {
		handleUserClicked(e) 
		{
			this.$emit('user-clicked', this.userInChat);
		},
		async ban()
		{
			this.socket.emit('banUser', {channel: this.channel, userBanned: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async kick()
		{
			this.socket.emit('kickUser', {channel: this.channel, userKicked: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async setAdmin()
		{
			this.socket.emit('setAdmin', {channel: this.channel, userSetAdmin: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async removeAdmin()
		{
			this.socket.emit('removeAdmin', {channel: this.channel, userRemovedAdmin: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async onTimeoutUser(nbSeconds)
		{
			this.socket.emit('timeoutUser', {userTimeouted: this.userInChat, channel: this.channel, duration_timeout: nbSeconds, sessionCookie: this.sessionCookie});
		},
		closeTimeOut()
		{
			this.showTimeOut = false;
		},
	}
}
</script>

<style>

#user-pseudo {
	margin-left: .5em;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
}

.admin {
	color: purple;
}
.owner {
	color: orange;
}

.user-in-chat {
	color: white;
	width: 90%;
	display: inline-flex;
}

.option-list {
	position: absolute;
	z-index: 999;
	padding: 1em;
	background: var(--pdark);
	border: 1px solid var(--pcyan);
	border-radius: .6em;
}

.options {
	color: white;
	margin-top: .1em;
	transition: color 0.2s ease;
}

.options:hover {
	cursor: pointer;
	color: var(--pcyan);
}
</style>
