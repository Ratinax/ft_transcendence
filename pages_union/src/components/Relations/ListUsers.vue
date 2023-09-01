<template>
    <div class="list-users-relations">
        <div class="header">
            <h1>{{ headerText }}</h1>
        </div>
        <div class="users">
            <User v-for="user in users" :key="user.id" :user="user" :isARequest="isFriendRequestList" @accept-friendship="onAcceptFriendship" @remove-relation="onRemoveRelation"/>
        </div>
    </div>
  
</template>

<script>
import axios from 'axios';
import User from './User.vue';
export default {
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
            users: [],
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
        onAcceptFriendship(asking_user_id)
        {
            this.$emit('accept-friendship', {friend_id : asking_user_id})
        },
        updateFriendList(users)
        {
            this.users = users;
        },
        onRemoveRelation(removed_user_id)
        {
            if (this.isFriendList || this.isFriendRequestList)
                this.$emit('remove-relation', {relationType: 'friend', friend_id : removed_user_id})
            else
                this.$emit('remove-relation', {relationType: 'block', userblocked_id : removed_user_id})

        },
    },
}
</script>

<style>

.header
{
    /* border: 0.001em solid black; */
    text-align: center;
    border-bottom: 0.2em solid white;
    background-color: #9A9A9A;
}
.users
{
    overflow: auto;
}
.list-users-relations
{
    border: 0.2em solid white;
    background-color: #BABABA;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: calc(100% / 3);
    white-space: nowrap;
    border-radius: 3%; 
}
</style>