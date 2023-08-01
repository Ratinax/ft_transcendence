<template>
    <div class="container">
        <ListChannels ref="listChannels" :channelSelected="selectedChannel" :user="user" :socket="socket" @channel-selected="onChannelSelected" @create-channel="createChannel" v-if="socket"/>
        <div class="messageszone">
          <Messages ref="messages"/>
          <SendMessage :channelId="selectedChannel.channel_id" :socket="socket" :userId="user.id" @create-message="createMessage"/>
        </div>
        <ListUsersChat ref="listUsersChat" @find-users-of-channel="findUsersOfChannel"/>
    </div>
  </template>
  
  
  <script>
  import ListChannels from "../components/Chat/ListChannels.vue";
  import ListUsersChat from "../components/Chat/ListUsersChat.vue";
  import Messages from "../components/Chat/Messages.vue";
  import SendMessage from "../components/Chat/SendMessage.vue";
  import { io } from 'socket.io-client';
  
  
  export default {
    name: 'Chat-Page',
    components:
    {
      ListChannels,
      Messages,
      SendMessage,
      ListUsersChat,
    },
    data()
    {
      return {
        selectedChannel: {},
        socket: null,
        user: {
          id: 1
        },
      }
    },
    created()
    {
      const userJson = this.$route.query.user;

      this.user = JSON.parse(decodeURIComponent(userJson));

    },
    async mounted()
    {
      this.socket =  io('http://localhost:3000/');
      this.socket.on('updateMessage', (response) => {
        this.updateMessages(null);
        console.log(response);
      });
      this.socket.on('updateListChannels', (response) => {
        console.log('response id :', response.user.id, '\nmy id :', this.user.id);
        if (response.user.id === this.user.id)
          this.updateListChannels(response.channel);
      });
      this.socket.on('updateListUsers', (response) => {
        if (response.channel.channel_id === this.selectedChannel.channel_id)
          this.updateListUsers(response.users);
      });
      // joinWrongPassword
      
    },
    methods:
    {
      updateListChannels(channel)
      {
        // TODO : faire que ca fasse ca uniquement si la personne est dedans
        this.$refs.listChannels.fetchChannels();
        // console.log('eriner channel :', channel[0])
        this.setSelectedChannel(channel);
        this.updateMessages();
      },
      updateMessages()
      {
        this.$refs.messages.updateMessages(this.selectedChannel);
      },
      onChannelSelected(channel)
      {
        this.setSelectedChannel(channel);
        this.updateMessages();
      },
      setSelectedChannel(channel)
      {
        console.log('le channel suppose selecte :', channel)
        this.selectedChannel = channel;
        this.findUsersOfChannel()
      },
      createChannel(content)
      {
        this.socket.emit('createChannel', { channel: content, user: this.user}); // TODO metter a content.channel
        console.log(this.socket);
      },
      createMessage(content)
      {
        this.socket.emit('createMessage', content);
      },
      findUsersOfChannel()
      {
        this.socket.emit('findUsersOfChannel', {channel: this.selectedChannel, user: this.user});
      },
      updateListUsers(listUsers)
      {
        this.$refs.listUsersChat.updateListUsers(listUsers);
      },
    }
  }
  
  </script>
  
  <style>
  .container
  {
    display: flex;
    width: 95%;
  }
  
  .messageszone
  {
    /* border: 0.1em solid white; */
    
    flex-direction: column;
    max-width: 100%;
    flex: 1;
  }

  
  .selection-color{
      color: white;
      background-color: #e95433;
  }
  </style>
  