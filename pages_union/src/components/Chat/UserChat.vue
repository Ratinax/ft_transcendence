<template>
    <div v-if="!userInChat.isInvited">
        <div class="user-in-chat">
            <span id="user-pseudo" :class="{'admin': userInChat.isAdmin, 'owner': userInChat.isOwner, 'selection-color' : isSelected}" @click="handleUserClicked">{{ userInChat.pseudo }}</span>
            <div :class="{'circle': true, 'green': userInChat.isConnected, 'red': !userInChat.isConnected}"></div>
        </div>
        <div v-if="isSelected" class="option-list">
            <div v-if="userInChat.id !== userInChannel.id">
                <div v-if="userInChannel.isAdmin && !userInChat.isOwner">
                    <p class="options" @click="kick">Kick</p> 
                    <p class="options" @click="ban">Ban</p>
                    <p class="options" @click="showTimeOut = true">Time out</p>
                </div>
                <div v-if="userInChannel.isOwner">
                    <div v-if="!userInChat.isAdmin">
                        <p class="options" @click="setAdmin">Set Admin</p>
                    </div>
                    <div v-if="userInChat.isAdmin">
                        <p class="options" @click="removeAdmin">Remove Admin</p>
                    </div>
                </div>
            </div>
                <p class="options">See Profile</p>
            </div>
        <TimeOut ref="timeout" :show="showTimeOut" @timeout-user="onTimeoutUser" @close="closeTimeOut"/>
    </div>
</template>

<script>
import { Socket } from 'socket.io-client';
import TimeOut from './TimeOut.vue';
export default {
    name: 'UserChat-Component',
    components:
    {
        TimeOut,
    },
    props: 
    {
        userInChannel: Object, // the user on the website with id, isAdmin, isOwner 
        userInChat: Object, // the other user in the chat 
        isSelected: Boolean,
        socket: Socket,
        channel: Object,
    },
    data()
    {
        return {
            showTimeOut: false,
        }
    },
    mounted()
    {
        this.socket.on('timeoutGoodRequest', (response) => {
            if (response.channel.channel_id === this.channel.channel_id && response.user.id === this.userInChannel.id)
                this.$refs.timeout.goodRequest();
        });
        this.socket.on('timeoutWrongAmount', (response) => {
            if (response.channel.channel_id === this.channel.channel_id && response.user.id === this.userInChannel.id)
                this.$refs.timeout.notGoodAmount();
        });
    },
    methods: {
        handleUserClicked() 
        {
            this.$emit('user-clicked', this.userInChat);
        },
        ban()
        {
            this.socket.emit('banUser', {channel: this.channel, user: this.userInChat});
        },
        kick()
        {
            this.socket.emit('kickUser', {channel: this.channel, user: this.userInChat});
        },
        setAdmin()
        {
            this.socket.emit('setAdmin', {channel: this.channel, user: this.userInChat});
        },
        removeAdmin()
        {
            this.socket.emit('removeAdmin', {channel: this.channel, user: this.userInChat});
        },
        onTimeoutUser(nbSeconds)
        {
            this.socket.emit('timeoutUser', {user: this.userInChannel, userTimeouted: this.userInChat, channel: this.channel, duration_timeout: nbSeconds});
        },
        closeTimeOut()
        {
            this.showTimeOut = false;
        },
    }
}
</script>

<style>
#user-pseudo
{
    cursor: pointer;
    transition: 300ms ease;
}
.admin
{
    color: purple;
}
.owner
{
    color: orange;
}

.user-in-chat
{
    display: flex;
    flex-direction: align;
    align-items: center;
}
</style>