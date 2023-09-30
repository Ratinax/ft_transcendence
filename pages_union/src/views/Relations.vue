<template>
	<Menu/>
	<div class="view">
		<div class="col search-container">
			<UsersSearched ref="UsersSearched" 
				:show="showSearchUsers"
				:pseudo="pseudo"
				@close="closeSearchUser"/>
			<div class="search-bar">
				<form @submit.prevent="searchUser">
					<div class="row relations-input-container">
						<font-awesome-icon class="relations-icon" icon="fa-solid fa-magnifying-glass" size="xl" />
						<input class="search-input" v-model="pseudo" placeholder="Search User (3 char min)"/>
					</div>
				</form>
			</div>
		</div>
		<div class="row">
			<ListUsers :is-friend-list="true" 
				:headerText="'Friend list'" 
				ref="friendList" 
				@remove-relation="onRemoveRelation"/>
			<ListUsers 
				:is-friend-request-list="true" 
				:headerText="'Friend request'" 
				ref="friendRequest" 
				@accept-friendship="onAcceptFriendship" 
				@remove-relation="onRemoveRelation"/>
			<ListUsers :is-block-list="true" 
				:headerText="'Block list'" 
				ref="blockList" 
				@remove-relation="onRemoveRelation"/>
		</div>
	</div>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { defineComponent } from 'vue';
import Menu from '../components/Menu.vue'
import UsersSearched from '../components/Relations/UsersSearched.vue';
import ListUsers from '../components/Relations/ListUsers.vue';

export default defineComponent({
	name: 'Relations-Page',
	components: 
	{
		ListUsers,
		Menu,
		UsersSearched,
	},
	data()
	{
		return {
			sessionCookie: '',
			socket: null as Socket | null,
			pseudo: '',
			showSearchUsers: false,
		}
	},
	async mounted()
	{
		this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
		this.socket = io(`http://${process.env.VUE_APP_IP}:3002/`);
		this.socket.on('acceptFriendship', (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.acceptFriendship();
		});
		this.socket.on('deleteFriendship', (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.deleteFriendship();
		}); 
		this.socket.on('deleteBlockship', (response: {sessionCookie: string}) => {
			if (response.sessionCookie === this.sessionCookie)
			this.deleteBlockship();
		});
	},
	methods:
	{
		onAcceptFriendship(body: {friend_id: number})
		{
			this.socket?.emit('acceptFriendship', {...body, sessionCookie: this.sessionCookie});
		},
		acceptFriendship()
		{
			if (this.$refs.friendList)
			(this.$refs.friendList as typeof ListUsers).fetchUsers();
			if (this.$refs.friendRequest)

			(this.$refs.friendRequest as typeof ListUsers).fetchUsers();
		},
		deleteFriendship()
		{
			(this.$refs.friendList as typeof ListUsers).fetchUsers();
			(this.$refs.friendRequest as typeof ListUsers).fetchUsers();
		},
		async onRemoveRelation(body: {friend_id: number, relationType: string} | {userblocked_id: number, relationType: string})
		{
			if (body.relationType === 'friend')
			{
				this.socket?.emit('removeFriendship', {...body, sessionCookie: this.sessionCookie});
			}
			else
			{
				this.socket?.emit('removeBlockship', {...body, sessionCookie: this.sessionCookie});
			}
		},
		deleteBlockship()
		{
			if (this.$refs.blockList)
			(this.$refs.blockList as typeof ListUsers).fetchUsers();
		},
		searchUser()
		{
			(this.$refs.UsersSearched as typeof UsersSearched).searchUsers();
			this.showSearchUsers = true;
		},
		closeSearchUser()
		{
			this.showSearchUsers = false;
		}
	}
});
</script>

<style>

.relations-input-container {
	background: white;
	align-items: center;
	border-radius: 1rem;
	border: .142rem solid transparent;
}

.relations-icon{
	padding-left: 1rem;
}

.search-container {
	padding: 3rem;
	align-items: center;
}

.search-input
{
	color: var(--pdark);
	font-size: 1rem;
	padding: 1rem;
	border-radius: 0 1rem 1rem 0;
}

.search-input::placeholder
{
	color: var(--pdark);
}

.relations-input-container:focus-within {
	border: .142rem solid var(--pcyan);
}

html {
	height: 100%;
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}
</style>
