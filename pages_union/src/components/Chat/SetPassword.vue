<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal">
        <div v-if="matrixIndex > 0">
            <p class="error">{{ matrixError[matrixIndex] }}</p>
        </div>
        <form @submit.prevent="setPassword">
          <div class="input-container">
              <input v-model="password" placeholder="Password" type="password"/>
              <input v-model="passwordCheck" placeholder="Repeat password" type="password"/>
          </div>
          <button type="submit"><span v-if="isSet">Set</span><span v-if="isChange">Change</span></button>
        </form>
        <form @submit.prevent="close">
          <button>Close</button>
        </form>
      </div>
    </div>
  </template>
  
<script>
// import { Socket } from 'socket.io-client';
export default {
  name: 'SetPassword',
  props: {
    show: Boolean,
    isChange: Boolean,
    isSet: Boolean,
  },
  data()
  {
    return {
      password: '',
      passwordCheck: '',
      matrixError: [
                'allright',
                'Passwords do not match',
                'Password must be between 3 and 20 characters'
            ],
      matrixIndex: 0,
    }
  },
  methods: 
  {
    close()
    {
      this.resetData();
      this.$emit('close');
    },
    notGoodLength()
    {
        this.matrixIndex = 2;
    },
    goodRequest()
    {
      this.close();
    },
    resetData()
    {
        this.password = '';
        this.passwordCheck = '';
        this.matrixIndex = 0;
    },
    setPassword()
    {
        if (this.password !== this.passwordCheck)
        {
            this.matrixIndex = 1;
            return ;
        }
        if (this.isSet)
            this.$emit('set-password', this.password);
        else if (this.isChange)
            this.$emit('change-password', this.password);
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
  