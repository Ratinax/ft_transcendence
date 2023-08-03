<template>
    <div v-if="!userInChat.isInvited">
        <div class="user-in-chat">
            <span id="user-pseudo" :class="{'admin': userInChat.isAdmin, 'owner': userInChat.isOwner, 'selection-color' : isSelected}" @click="handleUserClicked">{{ userInChat.pseudo }}</span>
            <div :class="{'circle': true, 'green': userInChat.isConnected, 'red': !userInChat.isConnected}"></div>
        </div>
        <div v-if="isSelected" class="popup">
            <div v-if="userInChat.id !== userInChannel.id">
                <div v-if="userInChannel.isAdmin && !userInChat.isOwner">
                    <p class="options" @click="kick">Kick</p> 
                    <p class="options" @click="ban">Ban</p>
                    <p class="options">Time out</p>
                </div>
                <div v-if="userInChannel.isOwner">
                    <div v-if="!userInChat.isAdmin">
                        <p class="options">Set Admin</p>
                    </div>
                    <div v-if="userInChat.isAdmin">
                        <p class="options">Remove Admin</p>
                    </div>
                </div>
            </div>
            <p class="options">See Profile</p>
        </div>
    </div>
</template>

<script>
import { Socket } from 'socket.io-client';
export default {
    name: 'UserChat-Component',
    props: 
    {
        userInChannel: Object, // the user on the website with id, isAdmin, isOwner 
        userInChat: Object, // the other in the chat 
        isSelected: Boolean,
        socket: Socket,
        channel: Object,
    },
    methods: {
        handleUserClicked() 
        {
            this.$emit('user-clicked', this.userInChat);
        },
        ban()
        {
            this.socket.emit('banUser', {channel: this.channel, userBanned : this.userInChat});
        },
        kick()
        {
            this.socket.emit('kickUser', {channel: this.channel, userKicked : this.userInChat});
        },
    }
}
</script>

<style>
#user-pseudo
{
    cursor: pointer;
    /* display: flex; */
}
.admin
{
    color: purple;
}
.owner
{
    color: orange;
}

.popup {

    background-color: #f9f9f9;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.options
{
    padding: 0;
    margin: 0;
}

.options:hover
{
    /* text-decoration: underline; */
    background-color: #c0c0c5;
}

.user-in-chat
{
    display: flex;
    flex-direction: align;
    align-items: center;
}

/* 
.popup p {
  margin: 0;
  padding: 0;
}

.popup button {
  margin-top: 10px;
} */
</style>