<template>
  <div v-if="userInChannel !== null" class="list-users-chat">
    <UserChat class="user-chat" v-for="userInChat in users" :userInChannel="userInChannel" :key="userInChat.id" :userInChat="userInChat" :isSelected="userSelected && userSelected.id === userInChat.id" :socket="socket" :channel="channel" @user-clicked="handleUserClicked"/>
  </div>
</template>

<script>
import { Socket } from 'socket.io-client';
import UserChat from './UserChat.vue';
export default {
    name: 'ListUsersChat',
    components:
    {
        UserChat,
    },
    props:
    {
        user: Object,
        socket: Socket,
        channel: Object,
    },
    data()
    {
        return {
            users: [],
            userSelected: Object,
            userInChannel: null, // the user with only id, isAdmin, and isOwner
        }
    },
    methods:
    {
        /**
         * set access writes for the user, set to null if no users
         */
        setAccessWrites()
        {
            if (!this.users)
            {
                this.userInChannel = null;
                return ;
            }
            for (let i = 0; i < this.users.length; i++)
            {
                if (this.users[i].id === this.user.id)
                {
                    this.userInChannel = {
                        isAdmin: this.users[i].isAdmin,
                        isOwner: this.users[i].isOwner,
                        id: this.users[i].id,
                    }
                    break;
                }
            }
        },
        updateListUsers(users)
        {
            this.users = users;
            this.setAccessWrites();
        },
        /**
         * set the user selected in the list
         * 
         * @param {} user - the user clicked in the list
         */
        handleUserClicked(user)
        {
            if (this.userSelected === user)
                this.userSelected = null;
            else
                this.userSelected = user;
        },
        getUserInChannel()
        {
            return (this.userInChannel);
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
.user-chat
{
    /* padding-bottom: 2%; */
    padding-top: 4%;
}
</style>