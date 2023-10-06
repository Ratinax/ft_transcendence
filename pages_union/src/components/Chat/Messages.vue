<template>
  <div ref="messageContainer" class="messages">
    <Message v-for="message in messages" :key="message.id"
			:username="message.user.pseudo" 
			:content="message.content" 
			:isAGameInvite="message.isAGameInvite"
			:isSender="message.isSender"
      :game="message.game"/>
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
          messages: [] as Array<{id: number,
            user: {pseudo: string},
            content: string,
            isAGameInvite: boolean,
            isSender: boolean,
            game: {ballAccel: number,
                ballSize: number, 
                ballSpeed: number,
                maxAngle: number,
                playerSize: number,
                playerSpeed: number,
                winScore: number}}>}
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
          const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/messages/${channel.name}`, {withCredentials: true});
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

<style scoped>
.messages
{
	padding: 2.5% 0;
	overflow-y: scroll;
    height: 88%;
}

::-webkit-scrollbar-track {
	background: var(--plight);
}

::-webkit-scrollbar-thumb {
	background: var(--pblack);
	border-radius: 1em;
}


</style>
