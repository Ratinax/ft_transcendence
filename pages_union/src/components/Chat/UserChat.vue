<template>
    <div v-if="!userInChat?.isInvited">
        <div class="user-in-chat">
            <span id="user-pseudo" :class="{'admin': userInChat?.isAdmin, 'owner': userInChat?.isOwner, 'selection-color' : isSelected}" @click="handleUserClicked">{{ userInChat?.pseudo }}</span>
            <div :class="{'circle': true, 'green': userInChat?.isConnected, 'red': !userInChat?.isConnected}"></div>
        </div>
        <div v-if="isSelected" class="option-list">
            <div v-if="userInChat?.id !== userInChannel?.id">
                <div v-if="userInChannel?.isAdmin && !userInChat?.isOwner">
                    <p class="options" @click="kick">Kick</p> 
                    <p class="options" @click="ban">Ban</p>
                    <p class="options" @click="showTimeOut = true">Time out</p>
                </div>
                <div v-if="userInChannel?.isOwner">
                    <div v-if="!userInChat?.isAdmin">
                        <p class="options" @click="setAdmin">Set Admin</p>
                    </div>
                    <div v-if="userInChat?.isAdmin">
                        <p class="options" @click="removeAdmin">Remove Admin</p>
                    </div>
                </div>
            </div>
                <p class="options">See Profile</p>
            </div>
        <TimeOut ref="timeout" :show="showTimeOut" @timeout-user="onTimeoutUser" @close="closeTimeOut"/>
    </div>
</template>

<script lang="ts">
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
        sessionCookie: String,
    },
    data()
    {
        return {
            showTimeOut: false,
        }
    },
    mounted()
    {
        (this as any).socket.on('timeoutGoodRequest', async (response: any) => {
            if (response.channel.channel_id === (this as any).channel.channel_id && (this as any).sessionCookie === response.sessionCookie)
            {
                if ((this as any).$refs.timeout)
                    (this as any).$refs.timeout.goodRequest();
            }
        });
        (this as any).socket.on('timeoutWrongAmount', async (response: any) => {
            if (response.channel.channel_id === (this as any).channel.channel_id && (this as any).sessionCookie === response.sessionCookie)
            {
                if ((this as any).$refs.timeout)
                    (this as any).$refs.timeout.notGoodAmount();
            }
        });
    },
    methods: {
        handleUserClicked() 
        {
            (this as any).$emit('user-clicked', (this as any).userInChat);
        },
        async ban()
        {
            (this as any).socket.emit('banUser', {channel: (this as any).channel, userBanned: (this as any).userInChat, sessionCookie: (this as any).sessionCookie});
        },
        async kick()
        {
            (this as any).socket.emit('kickUser', {channel: (this as any).channel, userKicked: (this as any).userInChat, sessionCookie: (this as any).sessionCookie});
        },
        async setAdmin()
        {
            (this as any).socket.emit('setAdmin', {channel: (this as any).channel, userSetAdmin: (this as any).userInChat, sessionCookie: (this as any).sessionCookie});
        },
        async removeAdmin()
        {
            (this as any).socket.emit('removeAdmin', {channel: (this as any).channel, userRemovedAdmin: (this as any).userInChat, sessionCookie: (this as any).sessionCookie});
        },
        async onTimeoutUser(nbSeconds: number)
        {
            (this as any).socket.emit('timeoutUser', {userTimeouted: (this as any).userInChat, channel: (this as any).channel, duration_timeout: nbSeconds, sessionCookie: (this as any).sessionCookie});
        },
        closeTimeOut()
        {
			// if ((this as any).showTimeOut)
            (this as any).showTimeOut = false;
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