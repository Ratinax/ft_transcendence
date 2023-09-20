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
		</div>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import UserChat from './UserChat.vue';
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ListUsersChat',
	components:
	{
		UserChat,
	},
	props:
	{
		sessionCookie: String,
		socket: Socket,
		channel: Object,
	},
	data()
{
		return {
			users: [] as Array<{id: number}>,
			userSelected: {} as ({id: number} | undefined),
			userInChannel: null, // the user with only id, isAdmin, and isOwner
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
			const userPerms = await axios.get(`http://${process.env.VUE_APP_IP}:3000/channels_users/userPerms?channelId=${this.channel.channel_id}`,
				{ withCredentials: true }, 
			);
			if (userPerms.data)
			this.userInChannel = userPerms.data;
			else
			this.userInChannel = null;
		},
		updateListUsers(users: Array<{id: number}>)
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
	}
});
</script>

<style>

.list-users-chat {
	align-items: center;

	background: var(--pblack);

	padding: 1em;
	margin-left: .7em;

	width: 7em;

	border: 2px solid var(--pcyan);
	border-radius: 1em;
}

</style>
