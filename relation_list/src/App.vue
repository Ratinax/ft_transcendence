<template>
  <div class="relations-lists">
    <ListUsers :is-friend-list="true" :user="client" :headerText="'Friend list'" ref="friendList"/>
    <ListUsers :is-friend-request-list="true" :user="client" :headerText="'Friend request'" ref="friendRequest" @accept-friendship="onAcceptFriendship" @refuse-friendship="onRefuseFriendship"/>
    <ListUsers :is-block-list="true" :user="client" :headerText="'Block list'" ref="blockRequest"/>
  </div>
</template>

<script>
import ListUsers from './components/ListUsers.vue'
import { io } from 'socket.io-client';

export default {
  name: 'App',
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
      this.socket.emit('accept', body);
    },
    onRefuseFriendship(body)
    {
      this.socket.emit('refuse', body);
    },
    acceptFriendship()
    {
        this.$refs.friendList.fetchUsers();
        this.$refs.friendRequest.fetchUsers();
    },
    deleteFriendship()
    {
      this.$refs.friendRequest.fetchUsers();
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