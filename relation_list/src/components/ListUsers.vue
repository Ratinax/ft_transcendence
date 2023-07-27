<template>
  <!-- <div v-for="user in users" :key="user.id"> -->
    <User v-for="user in users" :key="user.id" :user="user"> </User>
  <!-- </div> -->
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
            if (this.user.length <= 0)
                return ;
            try
            {
                const res = await axios.get(`http://localhost:3000/blockships/userblockedby/${this.user.id}`);
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

</style>