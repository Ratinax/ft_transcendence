<template>
  <div ref="messageContainer" class="messages">
    <Message v-for="message in messages" :key="message.id"
			:username="message.user.pseudo" 
			:content="message.content" 
			:isAGameInvite="message.isAGameInvite"
			:isSender="message.isSender"
      :id="message.id"
      :socket="socket"
      :sessionCookie="sessionCookie"/>
  </div>
</template>

<script lang="ts">
import Message from './Message.vue';
import axios from 'axios';
import { defineComponent } from 'vue';
import { Socket } from 'socket.io-client';

interface messageData {
  id: number,
  user: {pseudo: string},
  content: string,
  isAGameInvite: boolean,
  isSender: boolean
}

export default defineComponent({
    name: 'Messages-Component',
    components: 
    {
      Message,
    },
    props:
    {
      socket: Socket,
      sessionCookie: String,
    },
    data() {
      return {
          messages: [] as Array<messageData>}
    },
    created()
    {
      this.fetchMessages(null);
    },
    methods: 
    {
      async fetchMessages(channel: {name: string} | null | undefined)
      {
        if (!channel)
        {
          this.messages = [];
          return ;
        }
        try 
        {
          const response = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/messages/${channel.name}`, {withCredentials: true});
          this.messages = response.data;
        } 
        catch (error) 
        {
          console.error('Failed to get channel liste', error);
        }
        
      },
      async updateMessages(channel: {name: string} | null)
      {
          await this.fetchMessages(channel)

          this.$nextTick(() => {
              this.updateScrollPosition();
          });
      },
      addMessage(message: messageData)
      {
        this.messages.push(message);
        this.updateScrollPosition();
      },
      removeMessage(message_id: number)
      {
        for (let i = 0; i < this.messages.length; i++)
        {
          if (this.messages[i].id === message_id)
          {
            this.messages.splice(i, 1);
            break ;
          }
        }
      },
      updateScrollPosition()
      {
        this.$nextTick(() => {

          if (this.$refs.messageContainer)
          {
            (this.$refs.messageContainer as HTMLElement).scrollTop = (this.$refs.messageContainer as HTMLElement).scrollHeight; 
          }
        })
      }
    }
});
</script>

<style scoped>

.messages
{
	padding-top: .5em;
	overflow-y: scroll;
    height: 90%;
}

::-webkit-scrollbar-track {
	background: var(--plight);
}

::-webkit-scrollbar-thumb {
	background: var(--pdark);
	border-radius: 1em;
}

::-webkit-scrollbar {
	width: .25em;
}

@media screen and (max-height: 800px) {
	.messages {
		height: 85%;
	}
}

</style>
