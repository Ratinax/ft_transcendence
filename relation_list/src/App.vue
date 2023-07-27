<template>
  <div>
    <ListUsers :is-block-list="true" :user="client"/>
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

</style>