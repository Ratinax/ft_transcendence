<template>
  <div class="relations-lists">
      <Menu/>
      <ListUsers v-if="user" :is-friend-list="true" :user="user" :headerText="'Friend list'" ref="friendList" @remove-relation="onRemoveRelation"/>
      <ListUsers v-if="user" :is-friend-request-list="true" :user="user" :headerText="'Friend request'" ref="friendRequest" @accept-friendship="onAcceptFriendship" @remove-relation="onRemoveRelation"/>
      <ListUsers v-if="user" :is-block-list="true" :user="user" :headerText="'Block list'" ref="blockList" @remove-relation="onRemoveRelation"/>
    </div>
  </template>
  
<script>
  import ListUsers from '../components/Relations/ListUsers.vue'
  import Menu from '../components/Menu.vue'
  import { io } from 'socket.io-client';
  
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
        user: Object,
      }
    },
    mounted()
    {
      this.socket = io(`http://${process.env.VUE_APP_IP}:3000/`);
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
    created()
    {
      const userJson = this.$route.query.user;

      this.user = JSON.parse(decodeURIComponent(userJson));
      console.log('le user :', this.user);
    },
    methods:
    {
      onAcceptFriendship(body)
      {
        this.socket.emit('acceptFriendship', body);
      },
      acceptFriendship()
      {
        if (this.$refs.friendList)
          this.$refs.friendList.fetchUsers();
        if (this.$refs.friendRequest)
          this.$refs.friendRequest.fetchUsers();
      },
      onRefuseFriendship(body)
      {
        this.socket.emit('refuseFriendship', body);
      },
      deleteFriendship()
      {
        if (this.$refs.friendRequest)
          this.$refs.friendRequest.fetchUsers();
        if (this.$refs.friendList)
          this.$refs.friendList.fetchUsers();
      },
      onRemoveRelation(body)
      {
        if (body.relationType === 'friend')
        {
          this.socket.emit('removeFriendship', body);
        }
        else
          this.socket.emit('removeBlockship', body);
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