<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal">
        <div v-if="matrixIndex > 0">
            <p class="error">{{ matrixError[matrixIndex] }}</p>
        </div>
        <form @submit.prevent="joinAChannel">
          <div class="input-container">
            <input v-model="channelName" placeholder="Channel name"/>
            <input v-model="password" placeholder="Password (Optionnal)" type="password"/>
          </div>
          <button type="submit">Join</button>
        </form>
        <form @submit.prevent="close">
          <button>Close</button>
        </form>
        
      </div>
    </div>
  </template>
  
<script>
import { Socket } from 'socket.io-client';
export default {
  name: 'JoinChannel',
  props: {
    show: Boolean,
    socket: Socket,
    user: Object,
  },
  data()
  {
    return {
      channelName: '',
      password: '',
      isEmpty: false,
      matrixError: [
                'allright',
                'You must enter a channel name',
                'No such channel',
                'You are alrady in that channel',
                'Wrong password',
                'You are banned from this channel',
                'This channel is in private mode',
            ],
      matrixIndex: 0,
    }
  },
  mounted()
  {
    this.socket.on('joinNoSuchChannel', (response) => {
        if (response.user.id === this.user.id)
          this.noSuchChannel();
      });
      this.socket.on('joinAlreadyIn', (response) => {
        if (response.user.id === this.user.id)
          this.alreadyIn();
      });
      this.socket.on('joinWrongPassword', (response) => {
        if (response.user.id === this.user.id)
          this.wrongPassword();
      });
      this.socket.on('joinGoodRequest', (response) => {
        if (response.user.id === this.user.id)
          this.goodRequest();
      });
      this.socket.on('joinBanned', (response) => {
        if (response.user.id === this.user.id)
          this.joinBanned();
      });
      this.socket.on('joinPrivateMode', (response) => {
        if (response.user.id === this.user.id)
          this.privateMode();
      });
  },
  methods: 
  {
    joinAChannel()
    {
      this.matrixIndex = 0;
      if (this.channelName === '')
      {
        this.matrixIndex = 1;
        return ;
      }
      this.socket.emit('joinChannel', {channelName: this.channelName, password: this.password, user: this.user})
    },
    close()
    {
      console.log(`${process.env.VUE_APP_TEST}`)
      this.resetData();
      this.$emit('close');
    },
    resetData()
    {
      this.channelName = '';
      this.password = '';
      this.isEmpty = false;
      this.matrixIndex = 0;
    },
    noSuchChannel()
    {
      this.matrixIndex = 2;
    },
    alreadyIn()
    {
      this.matrixIndex = 3;
    },
    wrongPassword()
    {
      this.matrixIndex = 4;
    },
    joinBanned()
    {
      this.matrixIndex = 5;
    },
    goodRequest()
    {
      this.close();
    },
    privateMode()
    {
      this.matrixIndex = 6;
    }
  },
};
</script>
  
<style>

.input-container
{
  display: flex;
  flex-direction: column;
}
</style>
  