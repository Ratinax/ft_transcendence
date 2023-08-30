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
    mounted()
    {
      this.socket = io(`http://${process.env.VUE_APP_IP}:3002/`); // TODO effectuer l'action que sur l'user concernee pcq la requete sur tt les users
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
    methods:
    {
      async onAcceptFriendship(body)
      {
        const sessionCookie = await this.getSessionCookie();
        this.socket.emit('acceptFriendship', {...body, sessionCookie: sessionCookie});
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
        const sessionCookie = await this.getSessionCookie();
        console.log(body ,sessionCookie);
        if (body.relationType === 'friend')
        {
          this.socket.emit('removeFriendship', {...body, sessionCookie: sessionCookie});
        }
        else
        {
          this.socket.emit('removeBlockship', {...body, sessionCookie: sessionCookie});
        }
      },
      deleteBlockship()
      {
        if (this.$refs.blockList)
          this.$refs.blockList.fetchUsers();
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