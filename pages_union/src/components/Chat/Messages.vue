<template>
  <div ref="messageContainer" class="messages">
    <Message v-for="message in messages" :key="message.id"
			:username="message.user.pseudo" 
			:content="message.content" 
			:isAGameInvite="message.isAGameInvite"
			:isSender="false"/>
  </div>
</template>

<script>
import Message from './Message.vue';
import axios from 'axios';

export default {
    name: 'Messages-Component',
    components: 
    {
      Message,
    },
    data() {
      return {
          messages: [],
      }
    },
    created()
    {
      this.fetchMessages(null);
    },
    methods: 
    {
      async fetchMessages(channel)
      {
        if (!channel)
        {
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
      async updateMessages(channel)
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

          const container = this.$refs.messageContainer; 
          container.scrollTop = container.scrollHeight;
        }
      }
    }
}
</script>

<style>
.messages
{
	padding: 2.5% 0;
	overflow-y: scroll;
    height: 88%;
}

</style>
