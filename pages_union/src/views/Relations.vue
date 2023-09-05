<template>
  <div class="relations-lists">
      <Menu/>
      <ListUsers :is-friend-list="true" :headerText="'Friend list'" ref="friendList" @remove-relation="onRemoveRelation"/>
      <ListUsers :is-friend-request-list="true" :headerText="'Friend request'" ref="friendRequest" @accept-friendship="onAcceptFriendship" @remove-relation="onRemoveRelation"/>
      <ListUsers :is-block-list="true" :headerText="'Block list'" ref="blockList" @remove-relation="onRemoveRelation"/>
    </div>
  </template>
  
<script>
  import ListUsers from '../components/Relations/ListUsers.vue'
  import Menu from '../components/Menu.vue'
  import { io } from 'socket.io-client';
  import axios from 'axios';
  
  export default {
    name: 'Relations-Page',
    components: 
    {
      ListUsers,
      Menu,
    },
    data()
    {
      return {
        sessionCookie: '',
      }
    },
    async mounted()
    {
      this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
      this.socket = io(`http://${process.env.VUE_APP_IP}:3002/`);
      this.socket.on('acceptFriendship', (response) => {
        if (response.sessionCookie === this.sessionCookie)
          this.acceptFriendship();
      });
      this.socket.on('deleteFriendship', (response) => {
        if (response.sessionCookie === this.sessionCookie)
          this.deleteFriendship();
      }); 
      this.socket.on('deleteBlockship', (response) => {
        if (response.sessionCookie === this.sessionCookie)
          this.deleteBlockship();
      });
    },
    methods:
    {
      async onAcceptFriendship(body)
      {
        this.socket.emit('acceptFriendship', {...body, sessionCookie: this.sessionCookie});
      },
      acceptFriendship()
      {
        if (this.$refs.friendList)
          this.$refs.friendList.fetchUsers();
        if (this.$refs.friendRequest)
          this.$refs.friendRequest.fetchUsers();
      },
      deleteFriendship()
      {
        if (this.$refs.friendRequest)
          this.$refs.friendRequest.fetchUsers();
        if (this.$refs.friendList)
          this.$refs.friendList.fetchUsers();
      },
      async onRemoveRelation(body)
      {
        if (body.relationType === 'friend')
        {
          this.socket.emit('removeFriendship', {...body, sessionCookie: this.sessionCookie});
        }
        else
        {
          this.socket.emit('removeBlockship', {...body, sessionCookie: this.sessionCookie});
        }
      },
      deleteBlockship()
      {
        if (this.$refs.blockList)
          this.$refs.blockList.fetchUsers();
      },
    }
  }
</script>
  
<style>
.relations-lists
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
}
</style>