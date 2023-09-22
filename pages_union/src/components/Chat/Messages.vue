<template>
  <div ref="messageContainer" class="messages">
    <Message v-for="message in messages" :key="message.id"
			:username="message.user.pseudo" 
			:content="message.content" 
			:isAGameInvite="message.isAGameInvite"
			:isSender="message.isSender"/>
  </div>
</template>

<script lang="ts">
import Message from './Message.vue';
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Messages-Component',
    components: 
    {
      Message,
    },
    data() {
      return {
          messages: [] as Array<{id: number, user: {pseudo: string}, content: string, isAGameInvite: boolean, isSender: boolean}>,
      }
    },
    created()
    {
      this.fetchMessages(null);
    },
    methods: 
    {
      async fetchMessages(channel: {name: string} | null)
      {
        if (!channel)
        {
          return ;
        }
        try 
        {
          const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/messages/${channel.name}`, {withCredentials: true});
          console.log('resp: ', channel.name, response)
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
      updateScrollPosition()
      {
        if (this.$refs.messageContainer)
        {
          (this.$refs.messageContainer as HTMLElement).scrollTop = (this.$refs.messageContainer as HTMLElement).scrollHeight; 
        }
      }
    }
});
</script>

<style>
.messages
{
	padding: 2.5% 0;
	overflow-y: scroll;
    height: 88%;
}

::-webkit-scrollbar-track {
	background: var(--pblue);
	border-radius: 1em;
}

::-webkit-scrollbar-thumb {
	background: var(--pdark);
	border: 1px solid var(--pdark);
	border-radius: 1em;
}


</style>
