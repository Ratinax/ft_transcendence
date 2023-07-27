<template>
    <div class="list-users">
        <div class="header">
            <h1>{{ headerText }}</h1>
        </div>
        <div class="users">
            <User v-for="user in users" :key="user.id" :user="user" :isARequest="isFriendRequestList" />
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
                getText = 'friendships/pending'
            if (this.user.length <= 0)
                return ;
            try
            {
                const res = await axios.get(`http://localhost:3000/${getText}/${this.user.id}`);
                this.users = res.data;
                console.log(this.users);
            }
            catch (e)
            {
                console.error('Error un fetchUsers:', e);
            }
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
.list-users
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