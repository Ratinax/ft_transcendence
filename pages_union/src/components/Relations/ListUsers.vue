<template>
    <div class="list-users-relations">
        <div class="header">
            <h1>{{ headerText }}</h1>
        </div>
        <div class="users">
            <User v-for="user in users" :key="user.id" :user="user" :isARequest="isFriendRequestList" @accept-friendship="onAcceptFriendship" @refuse-friendship="onRefuseFriendship" @remove-relation="onRemoveRelation"/>
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
        user: Object,
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
            if (this.user.length <= 0)
                return ;
            try
            {
                const res = await axios.get(`http://localhost:3000/${getText}/${this.user.id}`);
                this.users = res.data;
                console.log('this.users :',this.users);
            }
            catch (e)
            {
                console.error('Error un fetchUsers:', e);
            }
        },
        onAcceptFriendship(user_id)
        {
            this.$emit('accept-friendship', {user_id : user_id, friend_id : this.user.id})
        },
        updateFriendList(users)
        {
            this.users = users;
        },
        onRefuseFriendship(user_id)
        {
            this.$emit('refuse-friendship', {user_id : user_id, friend_id : this.user.id})
        },
        onRemoveRelation(user_id)
        {
            if (this.isFriendList || this.isFriendRequestList)
                this.$emit('remove-relation', {relationType: 'friend', user_id : user_id, friend_id : this.user.id})
            else
                this.$emit('remove-relation', {relationType: 'block', userblocking_id : user_id, userblocked_id : this.user.id})

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
    height: 97vh;
    width: 30%;
    white-space: nowrap;
    border-radius: 3%; 

}
</style>