<template>
  <div ref="messageContainer" class="messages">
    <Message v-for="message in messages" :key="message.id" :username="message.user.pseudo" :content="message.content"/>
  </div>
</template>

<script>
import Message from '../components/Message.vue';
import axios from 'axios';

export default {
    name: 'Messages-Component',
    components: 
    {
      Message,
    },
    props: [],
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
      // TODO : faire en sorte qu'il ne fetch que les messages qu'il peut voir (pas par user bloque)
      async fetchMessages(channel)
      {
        if (!channel)
        {
          return ;
        }
        try 
        {
          const response = await axios.get(`http://192.168.1.159:3000/messages/${channel.name}`);
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
        const container = this.$refs.messageContainer;
  
        container.scrollTop = container.scrollHeight;
      }
    }
}
</script>

<style>
.messages
{
    border: 0.1vh solid black;
    flex: 1;
    position: relative;
    height: 90vh;
    padding-left: 1%;
    overflow-y: auto;
}
</style>