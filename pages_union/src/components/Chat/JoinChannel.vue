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
import axios from 'axios';
export default {
  name: 'JoinChannel',
  props: {
    show: Boolean,
    socket: Socket,
  },
  data()
  {
    return {
      channelName: '',
      password: '',
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
    this.socket.on('joinNoSuchChannel', async (response) => {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (response.sessionCookie === sessionCookie.data)
          this.noSuchChannel();
      });
    this.socket.on('joinAlreadyIn', async (response) => {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (response.sessionCookie === sessionCookie.data)
        this.alreadyIn();
    });
    this.socket.on('joinWrongPassword', async (response) => {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (response.sessionCookie === sessionCookie.data)
        this.wrongPassword();
    });
    this.socket.on('joinGoodRequest', async (response) => {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (response.sessionCookie === sessionCookie.data)
        this.goodRequest();
    });
    this.socket.on('joinBanned', async (response) => {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (response.sessionCookie === sessionCookie.data)
        this.joinBanned();
    });
    this.socket.on('joinPrivateMode', async (response) => {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (response.sessionCookie === sessionCookie.data)
        this.privateMode();
    });
  },
  methods: 
  {
    async joinAChannel()
    {
      this.matrixIndex = 0;
      if (this.channelName === '')
      {
        this.matrixIndex = 1;
        return ;
      }
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      if (!sessionCookie.data)
      {
        // TODO redirect to log page 
        return ;
      }
      this.socket.emit('joinChannel', {channelName: this.channelName, password: this.password, sessionCookie: sessionCookie.data})
    },
    close()
    {
      this.resetData();
      this.$emit('close');
    },
    resetData()
    {
      this.channelName = '';
      this.password = '';
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
  