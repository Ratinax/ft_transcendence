<template>
    <div class="list-users-relations">
        <div class="header">
            <h1 class="fade-text">{{ headerText }}</h1>
        </div>
        <div class="users-relations">
            <User v-for="user in users" 
				:key="user.id" 
				:user="user" 
				:isARequest="isFriendRequestList" 
				@accept-friendship="onAcceptFriendship" 
				@remove-relation="onRemoveRelation"/>
        </div>
    </div>
  
</template>

<script lang="ts">

import axios from 'axios';
import User from './User.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ListUsers',
    components:
    {
        User,
    },
    props:{
        isBlockList: Boolean,
        isFriendList: Boolean,
        isFriendRequestList: Boolean,
        headerText: String,
    },
    data()
    {
        return {
            users: [] as Array<{pseudo: string, profilPic: string, isConnected: boolean, id: number}> ,
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
                const res = await axios.get(`http://${process.env.VUE_APP_IP}:3000/${getText}`, {withCredentials: true});
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
        updateFriendList(users: Array<{pseudo: string, profilPic: string, isConnected: boolean, id: number}> )
        {
            this.users = users;
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
	display: flex;
	align-items: center;
	flex-direction: column;
}

.list-users-relations
{
	background: rgba(0, 0, 0, 0.4);
	border-radius: 1em;
	margin: auto 1em;
    width: calc(100% / 3);
	padding: 1em;
}
</style>
