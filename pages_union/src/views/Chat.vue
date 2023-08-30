<template>
    <div class="chat-container">
      <Menu/>
      <ListChannels ref="listChannels"  v-if="!!socket" :channelSelected="selectedChannel" :user="user" :socket="socket" @channel-selected="onChannelSelected" @leave-channel="onLeaveChannel"
      @get-is-user-owner="onGetIsUserOwner"/>
      <div class="messageszone">
        <Messages ref="messages" :user="user"/>
        <SendMessage ref="sendMessage" :showContent="!!selectedChannel.channel_id" :channelId="selectedChannel.channel_id" :socket="socket" :userId="user.id" @create-message="createMessage"/>
      </div>
      <ListUsersChat ref="listUsersChat" v-if="socket" :user="user" :channel="selectedChannel" :socket="socket"/>
    </div>
</template>
  

<script>
import ListChannels from "../components/Chat/ListChannels.vue";
import ListUsersChat from "../components/Chat/ListUsersChat.vue";
import Messages from "../components/Chat/Messages.vue";
import SendMessage from "../components/Chat/SendMessage.vue";
import Menu from "../components/Menu.vue"
import { io } from 'socket.io-client';
import axios from 'axios';

export default {
  name: 'Chat-Page',
  components:
  {
    ListChannels,
    Messages,
    SendMessage,
    ListUsersChat,
    Menu,
  },
  props:
  {
  },
  data()
  {
    return {
      user: Object,
      selectedChannel: {},
      socket: null,
    }
  },
  created()
  {
    const userJson = this.$route.query.user;

    this.user = JSON.parse(decodeURIComponent(userJson));
    console.log('le user :', this.user);
  },
  async mounted()
  {
    this.socket = io(`http://${process.env.VUE_APP_IP}:3001/`);
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
      {
        console.log('les nazi users :', response.users);
        this.updateListUsers(response.users);
      }
    });
    this.socket.on('updateAfterPart', (response) => {
      if (response.user.id === this.user.id 
        || response.channel.channel_id === this.selectedChannel.channel_id)
      {
        if (response.user.id === this.user.id)
        {
          this.updateListChannels({});
          this.updateMessages();
          this.updateListUsers(null);
        }
        else
        {
          this.updateListChannels(response.channel);
          this.updateListUsers(response.users);
        }
      }
    });
    this.socket.on('sendMessageTimeout', (response) => {
      if (this.selectedChannel.channel_id === response.channel_id && this.user.id === response.user_id)
        this.sendMessageTimeout(response.duration);
    });
    this.socket.on('sendMessageGoodRequest', (response) => {
      if (this.selectedChannel.channel_id === response.channel_id && this.user.id === response.user_id)
        this.sendMessageGoodRequest();
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
      if (this.$refs.listChannels)
      {
        this.$refs.listChannels.fetchChannels();
        this.setSelectedChannel(channel);
        this.updateMessages();
      }
    },
    updateMessages()
    {
      if (this.$refs.messages)
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
    async createMessage(content)
    {
      const sessionCookie = await this.getSessionCookie();
      this.socket.emit('createMessage', {...content, sessionCookie: sessionCookie});
    },
    async findUsersOfChannel()
    {
      const sessionCookie = await this.getSessionCookie();
      this.socket.emit('findUsersOfChannel', {channel: this.selectedChannel, user: this.user, sessionCookie: sessionCookie});
    },
    /**
     * 
     * @param {List} users - the list of users of the selectedChannel 
     */
    updateListUsers(users)
    {
      if (this.$refs.listUsersChat)
        this.$refs.listUsersChat.updateListUsers(users);
    },
    async onLeaveChannel(channel)
    {
      const sessionCookie = await this.getSessionCookie();
      this.socket.emit('leaveChannel', {channel: channel, user: this.user, sessionCookie: sessionCookie})
    },
    onGetIsUserOwner(channel_id)
    {
      if (this.$refs.listUsersChat)
      {
        const result = this.$refs.listUsersChat.getUserInChannel();
        if (result)
          this.$refs.listChannels.setIsUserOwner(result.isOwner, channel_id);
      }
    },
    sendMessageTimeout(duration)
    {
      if (this.$refs.sendMessage)
        this.$refs.sendMessage.timeout(duration);
    },
    sendMessageGoodRequest()
    {
      if (this.$refs.sendMessage)
        this.$refs.sendMessage.goodRequest();
    },
    async getSessionCookie()
    {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (!sessionCookie.data)
      {
        // TODO redirect to log page 
        return (null);
      }
      return (sessionCookie.data);
    }
  }
}
  
</script>

<style>
.chat-container
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
	background: linear-gradient(45deg, var(--plight), var(--plight));
  height: 100%;
}

.messageszone
{
  flex-direction: column;
  max-width: 60%;
  max-height: 100%;
  flex: 1;
}


.selection-color
{
    color: white;
    background-color: #e95433;
}

.option-list 
{
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 2;

}

.options
{
  overflow: hidden;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: 300ms ease;    padding-left: 0.1em

}

.options:hover
{
  background-color: #c0c0c5;
}


</style>
  