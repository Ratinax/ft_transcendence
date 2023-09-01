<template>
  <div v-if="userInChannel !== null" class="list-users-chat">
    <UserChat class="user-chat" v-for="userInChat in users" :sessionCookie="sessionCookie" :userInChannel="userInChannel" :key="userInChat.id" :userInChat="userInChat" :isSelected="userSelected && userSelected.id === userInChat.id" :socket="socket" :channel="channel" @user-clicked="handleUserClicked"/>
  </div>
</template>

<script>
import { Socket } from 'socket.io-client';
import UserChat from './UserChat.vue';
import axios from 'axios';
export default {
    name: 'ListUsersChat',
    components:
    {
        UserChat,
    },
    props:
    {
        sessionCookie: String,
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
        async setAccessWrites()
        {
            if (!this.users || !this.channel || !this.channel.channel_id )
            {
                this.userInChannel = null;
                return ;
            }
            const userPerms = await axios.get(`http://${process.env.VUE_APP_IP}:3000/channels_users/userPerms?channelId=${this.channel.channel_id}`,
            { withCredentials: true }, 
            );
            if (userPerms.data)
                this.userInChannel = userPerms.data;
            else
                this.userInChannel = null;
        },
        updateListUsers(users)
        {
            this.users = users;
            this.setAccessWrites();
        },
        /**
         * set the user to selected in the list
         * 
         * @param user - the user clicked in the list
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
    bottom: 0;
    top: 0;
    overflow-y: auto;
    padding-left: 1%;
}
.user-chat
{
    padding-top: 4%;
}
</style>