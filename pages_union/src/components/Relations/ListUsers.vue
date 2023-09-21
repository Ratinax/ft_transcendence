<template>
    <div class="list-users-relations">
        <div class="header">
            <h1 class="fade-text">{{ headerText }}</h1>
        </div>
        <div class="users">
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
                console.error('Error un fetchUsers:', e);
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
	background: var(--pblack);
	border-radius: 1.5em;
	align-items: center;
	justify-content: center;
}

h1 {
	display: inline;
	border-bottom: .01em solid var(--plight);
	padding-bottom: .1em;
	font-size: 2.2em
}

.list-users-relations
{
	background: var(--pdark);
	border-radius: 3em;
	margin: auto .8em;
	box-sizing: border-box;
    height: 90%;
    width: calc(100% / 3);
	border: 1px solid var(--pcyan);
	padding: 1em;
}
</style>
