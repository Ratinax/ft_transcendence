<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal">
        <div v-if="isEmpty === true">
            <p class="error">You must enter a channel name</p>
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
export default {
  name: 'JoinChannel',
  props: {
    show: Boolean,
  },
  data()
  {
    return {
      channelName: '',
      password: '',
      isEmpty: false,
    }
  },
  methods: 
  {
    // TODO : join un channel doit faire rejoindre ce channel
    joinAChannel()
    {
      if (this.channelName === '')
      {
        this.isEmpty = true;
        return ;
      }
      this.resetData();
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
      this.isEmpty = false;
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
  