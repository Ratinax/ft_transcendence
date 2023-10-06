<template>
	<div v-if="userInChannel !== null" class="list-users-chat-container">
		<div class="list-users-chat">
			<UserChat v-for="userInChat in users" 
				:sessionCookie="sessionCookie" 
				:userInChannel="userInChannel" 
				:key="userInChat.id" 
				:userInChat="userInChat" 
				:isSelected="userSelected && userSelected?.id === userInChat.id" 
				:socket="socket" 
				:channel="channel" 
				@user-clicked="handleUserClicked"
				@close-options="handleCleanUSerOpt"/>
		</div>
		<div class="form-ban-list-container">
			<form v-if="userInChannel && userInChannel?.isOwner" class="buttons" @submit.prevent="showBannedList">
				<button class="ft-button blue-button ban-list" type="submit">Ban List</button>
			</form>
		</div>
	</div>
	<UsersBanned
		ref="UsersBanned"
		:channel="channel"
		:show="showBannedUsers"
		@close="showBannedUsers = false">
	</UsersBanned>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import UserChat from './UserChat.vue';
import axios from 'axios';
import { defineComponent } from 'vue';
import UsersBanned from './UsersBanned.vue';

interface UserData {
	id: number, 
	isOwner: boolean, 
	isAdmin: boolean, 
	isConnected: boolean, 
	pseudo: string
}

export default defineComponent({
	name: 'ListUsersChat',
	components:
	{
		UserChat,
		UsersBanned,
	},
	props:
	{
		sessionCookie: String,
		socket: Socket || null,
		channel: Object,
	},
	data()
	{
		return {
			users: [] as Array<UserData>,
			userSelected: undefined as {id: number} | undefined,
			userInChannel: null as null | {id: number, isAdmin: boolean, isOwner: boolean, isBanned : boolean},
			showBannedUsers: false,
		}
	},
	methods:
	{
		/**
		 * set access writes for the user, set to null if no users
		*/
		async setAccessWrites()
		{
			if (!this.users || !this.channel || !(this.channel as {channel_id: number, name: string}).channel_id )
			{
				this.userInChannel = null;
				return ;
			}
			const userPerms = await axios.get(`http://${process.env.VUE_APP_IP}:3000/channels_users/userPerms?channelId=${this.channel?.channel_id}`,
				{ withCredentials: true }, 
			);
			if (userPerms.data)
			this.userInChannel = userPerms.data;
			else
			this.userInChannel = null;
		},
		updateListUsers(users: Array<{id: number, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>)
		{
			this.users = users;
			this.setAccessWrites();
		},
		/**
		 * set the user to selected in the list
		 * 
		 * @param user - the user clicked in the list
		*/
		handleUserClicked(user: {id: number} | undefined)
		{
			if (this.userSelected === user)
			this.userSelected = undefined;
			else
			this.userSelected = user;
		},
		handleCleanUSerOpt(user: {id: number} | undefined)
		{
			if (user && user.id === this.userSelected?.id)
			this.userSelected = undefined;
		},
		getUserInChannel()
		{
			return (this.userInChannel);
		},
		showBannedList()
		{
			this.showBannedUsers = true;
			(this.$refs?.UsersBanned as typeof UsersBanned)?.getBannedUsers();
		}
	}
});
</script>

<style scoped>

.list-users-chat-container {
	background: var(--pdark);

	padding: 1em;
	height: fit-content;
	margin-left: .7em;
	width: 10em;
	box-shadow: rgba(102, 252, 251, 0.4) 0px 2px 4px, rgba(102, 252, 251, 0.3) 0px 7px 13px -3px, rgba(102, 252, 251, 0.2) 0px -3px 0px inset;
	border-radius: 1em;
}

.list-users-chat {
	overflow-y: auto;
	max-height: 87.5vh;
	border-bottom: 1px solid var(--plight);
}

.ban-list
{
	font-size: 1em;
}

.buttons {
	margin-top: 1.42em;
	width: 100%;
}

.ft-button {
	width: 100%;
}

</style>
