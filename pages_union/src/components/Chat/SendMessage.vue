<template>
    <div class="send-message">
        <div v-if="showContent">
                <form @submit.prevent="sendMessage" class="send-message-form">
                    <input v-model="messageText" placeholder="Send a message" v-if="!isUserTimeout"/>
                    <input v-model="messageText" class="input-error" :placeholder="'You cannot send messages because you are timeout for ' + durationTimeoutString" v-else/>
                </form>
                <form @submit.prevent="inviteInGame">
                    <button type="submit">Invite in game</button>
                </form>
        </div>
    </div>
</template>

<script>
import { Socket } from 'socket.io-client';


export default {
    name: 'SendMessage',
    props: 
    {
        showContent: Boolean,
        socket: Socket,
        userId: Number,
        channelId: Number,
    },
    data()
    {
        return {
            messageText: '',
            isUserTimeout: false,
            durationTimeoutString: String,
        }
    },
    methods:
    {
        getCurrentDate() 
        {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            return formattedDate;
        },
        async sendMessage()
        {
            if (this.messageText === '')
                return ;
            this.$emit('create-message', {
                channel_id: this.channelId,
                user_id: this.userId,
                message: this.messageText,
                dateSent: this.getCurrentDate(),
                isAGameInvite: false,
            })
            this.messageText = '';
        },
        timeout(duration)
        {
            this.isUserTimeout = true;
            const days = Math.floor(duration / 86400);
            duration -= days * 86400;
            const hours = Math.floor(duration / 3600);
            duration -= hours * 3600;
            const minutes = Math.floor(duration / 60);
            duration -= minutes * 60;
            const seconds = Math.floor(duration);
            this.durationTimeoutString = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        },
        goodRequest()
        {
            this.durationTimeoutString = '';
            this.isUserTimeout = false;
        },
        inviteInGame()
        {
            this.$emit('create-message', {
                channel_id: this.channelId,
                user_id: this.userId,
                message: '',
                dateSent: this.getCurrentDate(),
                isAGameInvite: true,
            })
        },
    }

}
</script>

<style>

.send-message
{
    border: 1px solid black;
    height: 9.8%;
    position: relative;
}

.send-message input
{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 7.5em;
    transition: 300ms ease;
    padding-left: 1em;
}
.send-message button
{
    position: absolute;
    display: flex;
    align-items: center;
    right: 0;
    bottom: 0;
    top: 0;
}
.send-message input:focus
{
    background-color: #d9d9d9;
}
.input-error::placeholder
{
    color: red;
}
</style>