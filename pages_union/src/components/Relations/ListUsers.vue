<template>
	<div class="list-users-relations">
		<div class="header">
			<h1 class="fade-text">{{ headerText }}</h1>
		</div>
		<div v-if="users.length" class="col users-relations">
			<User v-for="user in users" 
				:key="user.id" 
				:user="user"
				:isARequest="isFriendRequestList" 
				@accept-friendship="onAcceptFriendship" 
				@remove-relation="onRemoveRelation"/>
		</div>
		<div v-else class="users-relations users-empty">
			<p v-if="isFriendList" >You have no friends.</p>
			<p v-else-if="isFriendRequestList">You have no friend request(s).</p>
			<p v-else>You have no user(s) blocked.</p>
		</div>
	</div>

</template>

<script lang="ts">

import axios from 'axios';
import User from './User.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ListUsers',
	components: {
		User,
	},
	props: {
		isBlockList: Boolean,
		isFriendList: Boolean,
		isFriendRequestList: Boolean,
		headerText: String,
	},
	data()
	{
		return {
			users: [] as Array<{pseudo: string, nickname: string, profilPic: string, isConnected: boolean, id: number}> ,
		}
	},
	async created()
{
		await this.fetchUsers();
	},
	methods:
	{
		async fetchUsers()
		{
			let getText = 'blockships/userblockedby';
			if (this.isFriendList) 
			getText = 'friendships/friendsof';
			else if (this.isFriendRequestList)
			getText = 'friendships/pending';
			try
			{
				const res = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/${getText}`, {withCredentials: true});
				this.users = res.data;
			}
			catch (e)
			{
				console.error('Error on fetchUsers:', e);
			}
		},
		onAcceptFriendship(asking_user_id: number)
		{
			this.$emit('accept-friendship', {friend_id : asking_user_id})
		},
		onRemoveRelation(removed_user_id: number)
		{
			if (this.isFriendList || this.isFriendRequestList)
			this.$emit('remove-relation', {relationType: 'friend', friend_id : removed_user_id})
			else
			this.$emit('remove-relation', {relationType: 'block', userblocked_id : removed_user_id})

		},
	},
});
</script>

<style scoped>

.list-users-relations {
	background: rgba(0, 0, 0, 0.4);
	box-shadow: rgba(50, 50, 50, 0.25) 0px 13px 27px -5px, rgba(50, 50, 50, 0.3) 0px 8px 16px -8px;

	border-radius: 1em;
	margin: 1em;
	padding: 1em;

	width: 33%;
	max-height: 100%;
}

.header {
	display: flex;
	align-items: center;
	justify-content: center;
}

h1 {
	display: inline;
	padding-bottom: .1em;
	font-size: 2.2em
}

.users-relations {
	align-items: center;
	overflow-y: auto;
	max-height: 70vh;
}

.users-empty {
	text-align: center;
	font-size: 1.25em;
	color: var(--plight);
}


@media screen and (max-width: 1360px) {
	.users-relations {
		max-height: 42vh;
	}
}

</style>
