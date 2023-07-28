<template>
  <div class="list-users-chat">
    <User v-for="user in users" :key="user.id" :user="user" :isSelected="userSelected.id === user.id" @user-clicked="handleUserClicked"/>
  </div>
</template>

<script>
import User from '../../components/Chat/User.vue';
export default {
    name: 'ListUsers',
    components:
    {
        User,
    },
    data()
    {
        return {
            users: [],
            userSelected: Object,
        }
    },
    methods: 
    {
        fetchUsers()
        {
            this.$emit('find-users-of-channel');
        },
        updateListUsers(users)
        {
            this.users = users; 
        },
        handleUserClicked(user)
        {
            this.userSelected = user;
        },

    }
    
}
</script>

<style>
.list-users-chat
{
    border: 0.1vh solid black;
    max-width: 15%;
    flex: 1;
    height: 96.8vh;
    overflow-y: auto;
    padding-left: 1%;
}
</style>