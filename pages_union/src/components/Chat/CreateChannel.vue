<template>
  <div class="modal-overlay" v-if="show">
    <div class="modal">
        <div v-if="matrixIndex > 0">
          <p class="error"> {{ matrixError[matrixIndex] }}</p>
        </div>
        <input v-model="channelName" placeholder="Channel name"/>
        <div v-for="category in categories" :key="category.id" class="radio-item">
          <input type="radio" :id="category.id" :value="category.id" v-model="selectedCategory">
          <label :for="category.id">{{ category.name }}</label>
        </div>
        <div v-if="selectedCategory === 3">
          <input v-model="password" placeholder="Password" type="password"/>
        </div>
        <form @submit.prevent="createChannel">
            <button type="submit">Create</button>
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
  name: 'CreateChannel',
  props: {
    show: Boolean,
    socket: Socket,
    user: Object,
  },
  data()
  {
    return {
      selectedCategory: 0,
      categories: [
        { id: 1, name: 'Public'}, 
        { id: 2, name: 'Private'}, 
        { id: 3, name: 'Protected by password'}, 
      ],
      matrixIndex: 0,
      matrixError: [
        'allright',
        'You must not have an empty field',
        'Channel name and password must be between 3 and 20 caracteres',
        'Channel already exists',
      ],
      password: '',
      channelName: '',
    }
  },
  mounted()
  {
    this.socket.on('createGoodRequest', (response) => {
        if (response.user.id === this.user.id)
          this.goodRequest();
    });
    this.socket.on('createAlreadyExists', (response) => {
      if (response.user.id === this.user.id)
        this.alreadyExists();
    });
    this.socket.on('createPasswordOrNameWrongSize', (response) => {
      if (response.user.id === this.user.id)
        this.wrongInputLength();
        
    });
    this.socket.on('createWrongCategory', (response) => {
      if (response.user.id === this.user.id)
        this.wrongCategory();
        
    });
  },
  methods: 
  {
    async createChannel()
    {
      const sessionCookie = await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true });
      console.log('da cookies :', sessionCookie);
      if (!sessionCookie.data)
      {
        // TODO redirect to log page
        return ;
      }
      this.socket.emit('createChannel', { channel: {
        name: this.channelName,
          password: this.password,
          category: this.categories[this.selectedCategory - 1].name,
          isADm: false,
      }, user: this.user,
      sessionCookie: sessionCookie.data});
      console.log('this.user :', this.user);
    },
    close()
    {
      this.resetData();
      this.$emit('close');
    },
    resetData()
    {
      this.password = '';
      this.channelName = '';
      this.selectedCategory = 0;
      this.matrixIndex = 0;
    },
    goodRequest()
    {
      this.close();
    },
    wrongCategory()
    {
      this.matrixIndex = 1;
    },
    wrongInputLength()
    {
      this.matrixIndex = 2;
    },
    alreadyExists()
    {
      this.matrixIndex = 3;
    },
  }
};
</script>
  
<style>

.radio-container 
{
  display: flex;
  flex-direction: column;
}

  </style>
  