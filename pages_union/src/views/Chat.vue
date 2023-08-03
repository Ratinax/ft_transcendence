<template>
    <div class="container">
        <ListChannels ref="listChannels"  v-if="socket" :channelSelected="selectedChannel" :user="user" :socket="socket" @channel-selected="onChannelSelected" @create-channel="createChannel"/>
        <div class="messageszone">
          <Messages ref="messages"/>
          <SendMessage :channelId="selectedChannel.channel_id" :socket="socket" :userId="user.id" @create-message="createMessage"/>
        </div>
        <ListUsersChat ref="listUsersChat" v-if="socket" :user="user" :channel="selectedChannel" :socket="socket"/>
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
      user: Object,
    }
  },
  created()
  {
    const userJson = this.$route.query.user;

    this.user = JSON.parse(decodeURIComponent(userJson));

  },
  async mounted()
  {
    this.socket = io('http://localhost:3000/');
    this.socket.on('updateMessage', (response) => {
      if (response.channel_id === this.selectedChannel.channel_id)
        this.updateMessages();
    });
    this.socket.on('updateListChannels', (response) => {
      if (response.user.id === this.user.id)
        this.updateListChannels(response.channel);
    });
    this.socket.on('updateListUsers', (response) => {
      if (response.channel.channel_id === this.selectedChannel.channel_id)
          this.updateListUsers(response.users);
    });
    this.socket.on('updateAfterBan', (response) => {
      if (response.userBanned.id === this.user.id
        || response.channel.channel_id === this.selectedChannel.channel_id)
      {
        this.updateListUsers(response.users);
        this.updateListChannels(response.channel);
      }
    });
    this.socket.on('updateAfterKick', (response) => {
      if (response.userKicked.id === this.user.id 
        || response.channel.channel_id === this.selectedChannel.channel_id)
      {
        this.updateListChannels(response.channel);
        if (response.userKicked.id === this.user.id)
        {
          console.log('fwkihwewweke')
          this.updateMessages();
          this.updateListUsers(null);
          // this.selectedChannel = null;
        }
        else
          this.updateListUsers(response.users);
      }
    });
  },
  methods:
  {
    /**
     * 
     * @param {Object} channel - Channel from which a user has entered or left
     */
    updateListChannels(channel)
    {
      this.$refs.listChannels.fetchChannels();
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
      this.socket.emit('createChannel', { channel: content, user: this.user}); // TODO metter a content.channel
    },
    createMessage(content)
    {
      this.socket.emit('createMessage', content);
    },
    findUsersOfChannel()
    {
      this.socket.emit('findUsersOfChannel', {channel: this.selectedChannel, user: this.user});
    },
    /**
     * 
     * @param {List} users - the list of users of the selectedChannel 
     */
    updateListUsers(users)
    {
      this.$refs.listUsersChat.updateListUsers(users);
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


.selection-color
{
    color: white;
    background-color: #e95433;
}
</style>
  