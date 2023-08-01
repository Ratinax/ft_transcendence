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
      matrixError: [
                'allright',
                'You must enter a channel name',
                'No such channel',
                'You are alrady in that channel',
                'Wrong password',
            ],
      matrixIndex: 0,
    }
  },
  methods: 
  {
    // TODO : join un channel doit faire rejoindre ce channel
    joinAChannel()
    {
      if (this.channelName === '')
      {
        this.matrixIndex = 1;
        return ;
      }
      this.$emit('join-channel', {channelName: this.channelName, password: this.password});
      if (this.matrixIndex === 0)
      {
        console.log('matrix index :', this.matrixIndex);
        this.resetData();
      }
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
  