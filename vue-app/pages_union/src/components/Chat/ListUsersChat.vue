<template>
	<div v-if="userInChannel !== null && display" class="list-users-chat-container">
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
			<form v-if="userInChannel && userInChannel?.isAdmin" class="buttons" @submit.prevent="showBannedList">
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
	pseudo: string,
	nickname: string,
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
		display: Boolean,
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
			try
			{
				const userPerms = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels_users/userPerms?channelId=${this.channel?.channel_id}`,
					{ withCredentials: true },
				);
				if (userPerms.data)
					this.userInChannel = userPerms.data;
				else
					this.userInChannel = null;
			}
			catch (e)
			{
				this.userInChannel = null;
			}
		},
		updateListUsers(users: Array<UserData>)
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

	animation: fadein .2s;
	padding: 1em;
	height: fit-content;
	margin-left: .7em;
	width: 25%;
	max-width: 10em;
	box-shadow: rgba(102, 252, 251, 0.4) 0px 2px 4px, rgba(102, 252, 251, 0.3) 0px 7px 13px -3px, rgba(102, 252, 251, 0.2) 0px -3px 0px inset;
	border-radius: 1em;
}

@keyframes fadein {
	from {
		transform: translateX(20px);
		opacity: 0;
	}
	to {
	transform: translateX(0px);
	opacity: 1;
	}
}

.list-users-chat {
	overflow-y: auto;
	max-height: 42em;
}

.ban-list
{
	font-size: 1em;
}

.buttons {
	margin-top: 1em;
	padding-top: .42em;
	border-top: 1px solid var(--plight);
}

.ft-button {
	width: 100%;
}

@media screen and (max-width: 700px) {
	.list-users-chat-container {
		position: absolute;
		right: .5em;
		width: 30%;
	}
}

</style>
