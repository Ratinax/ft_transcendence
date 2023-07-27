<template>
  <div class="relations-lists">
    <ListUsers :is-friend-list="true" :user="client" :headerText="'Friend list'"/>
    <ListUsers :is-friend-request-list="true" :user="client" :headerText="'Friend request'"/>
    <ListUsers :is-block-list="true" :user="client" :headerText="'Block list'"/>
  </div>
</template>

<script>
import ListUsers from './components/ListUsers.vue'

export default {
  name: 'App',
  components: 
  {
    ListUsers,
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
}
</script>

<style>
.relations-lists
{
  display: flex;
}
</style>