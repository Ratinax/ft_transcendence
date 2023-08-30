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
import axios from 'axios';

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
        this.socket.on('timeoutGoodRequest', async (response) => {
            const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });

            if (response.channel.channel_id === this.channel.channel_id && sessionCookie.data === response.sessionCookie)
            {
                if (this.$refs.timeout)
                    this.$refs.timeout.goodRequest();
            }
        });
        this.socket.on('timeoutWrongAmount', async (response) => {
            const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
            if (response.channel.channel_id === this.channel.channel_id && sessionCookie.data === response.sessionCookie)
            {
                if (this.$refs.timeout)
                    this.$refs.timeout.notGoodAmount();
            }
        });
    },
    methods: {
        handleUserClicked() 
        {
            this.$emit('user-clicked', this.userInChat);
        },
        async ban()
        {
            const sessionCookie = await this.getSessionCookie()
            this.socket.emit('banUser', {channel: this.channel, sessionCookie: sessionCookie});
        },
        async kick()
        {
            const sessionCookie = await this.getSessionCookie()
            this.socket.emit('kickUser', {channel: this.channel, sessionCookie: sessionCookie});
        },
        async setAdmin()
        {
            const sessionCookie = await this.getSessionCookie()
            this.socket.emit('setAdmin', {channel: this.channel, sessionCookie: sessionCookie});
        },
        async removeAdmin()
        {
            const sessionCookie = await this.getSessionCookie()
            this.socket.emit('removeAdmin', {channel: this.channel, sessionCookie: sessionCookie});
        },
        async onTimeoutUser(nbSeconds)
        {
            const sessionCookie = await this.getSessionCookie()
            this.socket.emit('timeoutUser', {userTimeouted: this.userInChat, channel: this.channel, duration_timeout: nbSeconds, sessionCookie: sessionCookie});
        },
        closeTimeOut()
        {
            this.showTimeOut = false;
        },
        async getSessionCookie()
        {
            const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
            if (!sessionCookie.data)
            {
                // TODO redirect to log page 
                return (null);
            }
            return (sessionCookie.data);
        }
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