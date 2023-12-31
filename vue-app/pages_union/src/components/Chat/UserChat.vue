<template>
	<div ref="optionsRef">
		<div class="row user-in-chat">
			<span id="user-pseudo" 
				:class="{'admin': userInChat?.isAdmin, 'owner': userInChat?.isOwner}" 
				@click="handleUserClicked">
				<font-awesome-icon v-if="userInChat?.isAdmin || userInChat?.isOwner" icon="fa-solid fa-crown" size="xs" />
				<font-awesome-icon v-else icon="fa-solid fa-user" size="xs" />
				{{ userInChat?.nickname }}
			</span>
		</div>
		<div v-if="isSelected" class="option-list">
			<div v-if="userInChat?.id !== userInChannel?.id">
				<div v-if="userInChannel?.isAdmin && !userInChat?.isOwner">
					<p class="options" @click="kick">Kick</p> 
					<p class="options" @click="ban">Ban</p>
					<p class="options" @click="showTimeOut = true">Time out</p>
				</div>
				<div v-if="userInChannel?.isOwner">
					<div v-if="!userInChat?.isAdmin">
						<p class="options" @click="setAdmin">Set Admin</p>
					</div>
					<div v-if="userInChat?.isAdmin">
						<p class="options" @click="removeAdmin">Remove Admin</p>
					</div>
				</div>
			</div>
			<p class="options" @click="seeProfil">
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

<script lang="ts">
import { Socket } from 'socket.io-client';
import TimeOut from './TimeOut.vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
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
			router: useRouter(),
			showTimeOut: false as boolean,
		}
	},
	mounted()
	{
		this.socket?.on('timeoutGoodRequest', async () => {
			if (this.$refs.timeout)
				(this.$refs.timeout as typeof TimeOut).goodRequest();
		});
		this.socket?.on('timeoutWrongAmount', async () => {
			if (this.$refs.timeout)
				(this.$refs.timeout as typeof TimeOut).notGoodAmount();
		});
		document.addEventListener("click", this.handleClickOutsideOptions);
	},
	beforeUnmount() {
		document.removeEventListener("click", this.handleClickOutsideOptions);
	},
	methods: {
		handleUserClicked() 
		{
			this.$emit('user-clicked', this.userInChat);
		},
		async ban()
		{
			this.socket?.emit('banUser', {channel: this.channel, userBanned: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async kick()
		{
			this.socket?.emit('kickUser', {channel: this.channel, userKicked: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async setAdmin()
		{
			this.socket?.emit('setAdmin', {channel: this.channel, userSetAdmin: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async removeAdmin()
		{
			this.socket?.emit('removeAdmin', {channel: this.channel, userRemovedAdmin: this.userInChat, sessionCookie: this.sessionCookie});
		},
		async onTimeoutUser(nbSeconds: number)
		{
			this.socket?.emit('timeoutUser', {userTimeouted: this.userInChat, channel: this.channel, duration_timeout: nbSeconds, sessionCookie: this.sessionCookie});
		},
		closeTimeOut()
		{
			this.showTimeOut = false;
		},
		seeProfil()
		{
			this.router.push({name: 'UserPage', params: {pseudo: this.userInChat?.pseudo}})
		},
		handleClickOutsideOptions(event: any) 
		{
			if (this.$refs.optionsRef && !(this.$refs.optionsRef as HTMLDivElement).contains(event.target)) 
			{
				this.$emit('close-options', this.userInChat);
			}
		},
	}
})
</script>

<style scoped>

#user-pseudo {
	display: flex;
	align-items: center;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
}

svg {
	width: 2em;
	margin-right: .42em;
	padding-bottom: .2em;
}

.admin {
	color: purple;
}
.owner {
	color: orange;
}

.user-in-chat {
	color: white;

	margin-bottom: .25em;
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
