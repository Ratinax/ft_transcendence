<template>
    <div class="container">
        <ListChannels ref="listeChannels" :channelSelected="selectedChannel" @channel-selected="onChannelSelected" @create-channel="createChannel"/>
        <div class="messageszone">
          <Messages ref="messages"/>
          <SendMessage :channelId="selectedChannel.channel_id" :socket="socket" @create-message="createMessage"/>
        </div>
        <ListUsers ref="listUsers" @find-users-of-channel="findUsersOfChannel"/>
    </div>
  </template>
  
  
  <script>
  import ListChannels from "./views/Chat/ListChannels.vue";
  import ListUsers from "./views/Chat/ListUsers.vue";
  import Messages from "./views/Chat/Messages.vue";
  import SendMessage from "./views/Chat/SendMessage.vue";
  import { io } from 'socket.io-client';
  
  
  export default {
    name: 'Chat-Page',
    components:
    {
      ListChannels,
      Messages,
      SendMessage,
      ListUsers,
    },
    data()
    {
      return {
        selectedChannel: {},
        socket: null,
      }
    },
    mounted()
    {
      this.socket = io('http://localhost:3000/');
      this.socket.on('updateMessage', (response) => {
        this.updateMessages(null);
        console.log(response);
      });
      this.socket.on('updateChannel', (response) => {
        this.updateChannel(response);
      });
      this.socket.on('listUsers', (response) => {
        this.updateListUsers(response);
      });
    },
    methods:
    {
      updateChannel(channel)
      {
  
        // TODO : faire que ca fasse ca uniquement si la personne est dedans
        this.$refs.listeChannels.addChannel(channel);
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
        this.selectedChannel = channel;
        this.findUsersOfChannel()
      },
      createChannel(content)
      {
        this.socket.emit('createChannel', content);
      },
      createMessage(content)
      {
        this.socket.emit('createMessage', content);
      },
      findUsersOfChannel()
      {
        this.socket.emit('findUsersOfChannel', this.selectedChannel);
      },
      updateListUsers(listUsers)
      {
        this.$refs.listUsers.updateListUsers(listUsers);
      }
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
  