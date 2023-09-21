<template>
	<div class="row relations-page">
		<Menu/>
		<div class="list-users">
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
import ListUsers from '../components/Relations/ListUsers.vue'
import Menu from '../components/Menu.vue'
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Relations-Page',
	components: 
	{
		ListUsers,
		Menu,
	},
	data()
	{
		return {
			sessionCookie: '',
			socket: null as Socket | null,
		}
	},
	async mounted()
	{
		this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
		this.socket = io(`http://${process.env.VUE_APP_IP}:3002/`); // TODO effectuer l'action que sur l'user concernee pcq la requete sur tt les users
		this.socket.on('acceptFriendship', (response) => {
			this.acceptFriendship();
		});
		this.socket.on('deleteFriendship', (response) => {
			this.deleteFriendship();
		}); 
		this.socket.on('deleteBlockship', (response) => {
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
				(this.$refs.friendList as typeof ListUsers).fetchUsers();
		},
		deleteFriendship()
		{
			if (this.$refs.friendRequest)
				(this.$refs.friendList as typeof ListUsers).fetchUsers();
			if (this.$refs.friendList)
				(this.$refs.friendList as typeof ListUsers).fetchUsers();
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
	}
});
</script>

<style>

.relations-page {
	height: 100vh;
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}

.list-users {
	margin: 3em;
	display: flex;
	width: 100%;
}
</style>
