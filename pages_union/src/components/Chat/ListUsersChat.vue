<template>
	<div class="users-list">
		<div v-if="userInChannel !== null" class="list-users-chat">
			<UserChat class="user-chat" 
				v-for="userInChat in users" 
				:sessionCookie="sessionCookie" 
				:userInChannel="userInChannel" 
				:key="userInChat.id" 
				:userInChat="userInChat" 
				:isSelected="userSelected && userSelected?.id === userInChat.id" 
				:socket="socket" 
				:channel="channel" 
				@user-clicked="handleUserClicked"/>
			<div v-if="userInChannel && userInChannel?.isOwner">
				<form class="buttons" @submit.prevent="showBannedList">
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
	</div>
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
			this.$emit('set-is-user-owner', this.channel?.channel_id);
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
		handleUserClicked(user: {id: number})
		{
			if (this.userSelected === user)
				this.userSelected = undefined;
			else
				this.userSelected = user;
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

<style>
.list-users-chat {
	align-items: center;

	background: linear-gradient(var(--pblack), var(--pdark));

	padding: 1em;
	margin-left: .7em;

	width: 7em;

	box-shadow: rgba(102, 252, 251, 0.4) 0px 2px 4px, rgba(102, 252, 251, 0.3) 0px 7px 13px -3px, rgba(102, 252, 251, 0.2) 0px -3px 0px inset;
	border-radius: 1em;
}

.ban-list
{
	font-size: 1em;
}

</style>
