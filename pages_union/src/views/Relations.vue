<template>
	<Menu/>
	<div class="view col relations-page" @click.self="closeSearchUser">
		<div class="col search-container">
			<form @submit.prevent="searchUser">
				<div class="row relations-input-container">
					<font-awesome-icon class="relations-icon" icon="fa-solid fa-magnifying-glass" size="xl" />
					<input name="search_content" class="search-input" v-model="pseudo" placeholder="Search User (3 char min)"/>
				</div>
			</form>
			<UsersSearched ref="UsersSearched" 
				:show="showSearchUsers"
				:pseudo="pseudo"
				@displaySearch="displaySearch"
				@displayError="displayErrorMessage"
				@close="closeSearchUser"/>
			<Transition name="showErrorMessageTransition">
				<p v-if="showErrorMessage" class="relations-search-error-message">{{ searchErrorMessage }}</p>
			</Transition>
		</div>
		<div class="row list-users">
			<ListUsers :is-friend-list="true" 
				:headerText="'Friend list'" 
				ref="friendList" 
				@remove-relation="onRemoveRelation"/>
			<ListUsers 
				:is-friend-request-list="true" 
				:headerText="'Friend request(s)'" 
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
			showErrorMessage: false,
			searchErrorMessage: '',
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
			console.log(this.showErrorMessage);
			console.log(this.searchErrorMessage);
			if (this.pseudo && this.pseudo.length > 2) {
				if (this.pseudo.length > 2) {
					(this.$refs.UsersSearched as typeof UsersSearched).searchUsers();
				}
			}
			else {
				this.displayErrorMessage("Not enough characters (3 min).");
			}

		},
		displaySearch() {
			this.showErrorMessage = false;
			this.showSearchUsers = true;
		},
		displayErrorMessage(errorMessage: string) {
			this.showSearchUsers = false;
			this.showErrorMessage = true;
			this.searchErrorMessage = errorMessage;
		},
		closeSearchUser()
		{
			this.showSearchUsers = false;
		}
	}
});
</script>

<style>

.relations-page {
	align-items: center;
}

.relations-input-container {
	background: white;
	align-items: center;
	border-radius: .742rem;
	border: .142rem solid transparent;
}

.relations-icon {
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
	width: 15.42em;
	border-radius: 0 1rem 1rem 0;
}

.search-input::placeholder
{
	color: var(--pdark);
}

.relations-input-container:focus-within {
	border: .142rem solid var(--pblue);
}

.relations-search-error-message {
	position: absolute;
	color: #ff1f5e;
	font-size: 1.05em;
	top: 6.6em;
	z-index: 2;
	text-align: center;
	width: 100%;
}

.showErrorMessageTransition-enter-active,
.showErrorMessageTransition-leave-active {
	transition: all 0.5s ease;
}

.showErrorMessageTransition-enter-from,
.showErrorMessageTransition-leave-to {
	transform: translateY(-15px);
	opacity: 0;
}

.list-users {
	width: 100%;
	max-width: 1600px;
}

.view {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}

@media screen and (max-width: 1360px) {

	.list-users {
		justify-content: space-evenly;
		flex-wrap: wrap;
	}

	.list-users > .list-users-relations {
		width: 42%;
		margin-top: .742rem;
	}

	.search-container {
		padding: 2em 0;
	}

	.relations-search-error-message {
		top: 5.7em;
	}
}

@media screen and (max-width: 1060px) {
	.list-users {
		width: 95%;
		align-items: center;
		flex-direction: column;
	}

	.list-users > .list-users-relations {
		margin: 0;
		margin-top: 1rem;
		width: 90%;
	}
}

</style>
