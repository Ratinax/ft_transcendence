<template>
    <div class="relations-lists">
      <ListUsers :is-friend-list="true" :user="client" :headerText="'Friend list'" ref="friendList" @remove-relation="onRemoveRelation"/>
      <ListUsers :is-friend-request-list="true" :user="client" :headerText="'Friend request'" ref="friendRequest" @accept-friendship="onAcceptFriendship" @remove-relation="onRemoveRelation"/>
      <ListUsers :is-block-list="true" :user="client" :headerText="'Block list'" ref="blockList" @remove-relation="onRemoveRelation"/>
    </div>
  </template>
  
  <script>
  import ListUsers from './components/Relations/ListUsers.vue'
  import { io } from 'socket.io-client';
  
  export default {
    name: 'Relations-Page',
    components: 
    {
      ListUsers,
    },
    mounted()
    {
      this.socket = io('http://localhost:3000/');
      this.socket.on('acceptFriendship', (response) => {
        this.acceptFriendship(response);
      });
      this.socket.on('deleteFriendship', (response) => {
        this.deleteFriendship(response);
      }); 
      this.socket.on('deleteBlockship', (response) => {
        this.deleteBlockship(response);
      });
    },
    data()
    {
      return {
        client: {
        id: 1,
        pseudo: 'lfuerfl',
        isConnected: true,
      },
      }
    },
    methods:
    {
      onAcceptFriendship(body)
      {
        this.socket.emit('acceptFriendship', body);
      },
      acceptFriendship()
      {
          this.$refs.friendList.fetchUsers();
          this.$refs.friendRequest.fetchUsers();
      },
      onRefuseFriendship(body)
      {
        this.socket.emit('refuseFriendship', body);
      },
      deleteFriendship()
      {
        this.$refs.friendRequest.fetchUsers();
        this.$refs.friendList.fetchUsers();
      },
      onRemoveRelation(body)
      {
        console.log(body)
        if (body.relationType === 'friend')
        {
          console.log('ici');
          this.socket.emit('removeFriendship', body);
        }
        else
          this.socket.emit('removeBlockship', body);
      },
      deleteBlockship()
      {
        this.$refs.blockList.fetchUsers();
      },
    }
  }
  </script>
  
  <style>
  .relations-lists
  {
    display: flex;
  }
  </style>