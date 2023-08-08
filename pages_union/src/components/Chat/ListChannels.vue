<template>
  <div class="list-channels" ref="channelsButtons">
    <div class="channels-buttons">
      <channel ref="channelRef" v-for="channel in channels" :key="channel.id" :channel="channel" :socket="socket" :user="user" :isSelected="channelSelected.channel_id === channel.channel_id" @channel-clicked="handleChannelClicked" @leave-channel="onLeaveChannel"
      @get-is-user-owner="onGetIsUserOwner"
      @update-channels="onUpdateChannels"/>
      <div :class="{'nochannel': channels.length === 0, 'buttons': true}">
        <div class="new-channel">
          <button @click="showCreateChannel = true">Create Channel</button>
          <CreateChannel :show="showCreateChannel" :socket="socket" :user="user" @close="showCreateChannel = false">
            <!-- Contenu du pop-up personnalisé -->
          </CreateChannel>
        </div>
        <div class="join-channel">
          <button @click="showJoinChannel = true">Join Channel</button>
          <JoinChannel :show="showJoinChannel" :socket="socket" :user="user" ref='joinChannel' @close="showJoinChannel = false" >
          </JoinChannel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Channel from './Channel.vue';
import CreateChannel from './CreateChannel.vue';
import JoinChannel from './JoinChannel.vue';
import axios from 'axios';

export default {
    name: 'ListChannels',
    components: {
      Channel,
      CreateChannel,
      JoinChannel,
    },
    props: 
    {
      user: Object,
      channelSelected: Object,
      socket: null,
    },
    data() {
      return {
        channels: [],
        showCreateChannel: false,
        showJoinChannel: false,
      }
    },
    created() 
    {
      this.fetchChannels();
    },
    methods: {
      async fetchChannels() {
        try 
        {
          const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/channels/${this.user.id}`);
          this.channels = response.data;
        } 
        catch (error) 
        {
          console.error('Failed to get channel liste', error);
          return ;
        }
        this.$nextTick(() => {
          this.updateScrollPosition();
        })
      },
      addChannel(channel)
      {
        // // console.log('eioeroe')
        this.channels.push(channel)
        this.$nextTick(() => {
          this.updateScrollPosition()
        })
      },
      handleChannelClicked(channel) 
      {
        this.$emit('channel-selected', channel);
      },
      updateScrollPosition()
      {
        const container = this.$refs.channelsButtons;
  
        container.scrollTop = container.scrollHeight;
      },
      onLeaveChannel(channel)
      {
        this.$emit('leave-channel', channel);
      },
      onGetIsUserOwner(channel_id)
      {
        this.$emit('get-is-user-owner', channel_id);
      },
      setIsUserOwner(result, channel_id)
      {
        for (let i = 0; i < this.$refs.channelRef.length; i++)
        {
          if (this.$refs.channelRef[i].channel.channel_id === channel_id)
          {
            this.$refs.channelRef[i].setIsUserOwner(result);
            break ;
          }
        }
      },
      onUpdateChannels()
      {
        this.fetchChannels();
      }
    },
}
</script>

<style>

.nochannel
{
  top: 0;
}

.list-channels
{
  border: 0.1vh solid black;
  /* width: 25%; */
  white-space: nowrap;
  resize: horizontal;
  overflow: auto;
  height: 97vh;
  position: relative; /* to make intern components able to move*/
  flex: 0 0 auto; 
   /* La div 'left' prend autant d'espace que possible */
  min-width: 20%;
  max-width: 30%;
}
.buttons
{
  position: absolute;
  bottom: 0;
  width: 100%;
  /* top: 0; */
  /* justify-content: space-between; */
}
.new-channel
{
  /* flex: 0 0 auto; */
  /* flex: 1; */
  /* justify-content: space-between; */
  display: inline-block;
}
.join-channel
{
  /* flex: 1; */
  /* flex: 0 0 auto; */
  display: inline-block;
}
.channels-buttons
{
  /* overflow-y: auto; */
  position: absolute;
  left: 5%;
  width: 100%;
  padding-bottom: 0.6em;
}
</style>