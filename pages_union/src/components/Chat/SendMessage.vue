<template>
    <div class="send-message">
        <form @submit.prevent="sendMessage">
            <label></label>
            <input v-model="messageText" placeholder="Send a message"/>
            <button type="submit">Send</button>
          </form>
    </div>
</template>

<script>
import { Socket } from 'socket.io-client';


export default {
    name: 'SendMessage',
    props: 
    {
        socket: Socket,
        userId: Number,
        channelId: Number,

    },
    data()
    {
        return {
            messageText: '',
        }
    },
    methods: 
    {
        getCurrentDate() {
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
            this.$emit('create-message', {
                channel: this.channelId,
                user: 1,
                content: this.messageText,
                dateSent: this.getCurrentDate(),
            })
            this.messageText = ''
        }
    }

}
</script>

<style>
.send-message
{
    border: 0.1vh solid black;
    height: 6.6vh;
}
</style>