<template>
    <div class="modal-overlay" v-if="show">
      <div class="modal">
        <div v-if="matrixIndex > 0">
            <p class="error">{{ matrixError[matrixIndex] }}</p>
        </div>
        <form @submit.prevent="timeoutUser">
          <div class="input-time">
            <input v-model="days" placeholder="00" type="text"/>
            <label>:</label>
            <input v-model="hours" placeholder="00" type="text"/>
            <label>:</label>
            <input v-model="minutes" placeholder="00" type="text"/>
            <label>:</label>
              <input v-model="seconds" placeholder="00" type="text"/>
          </div>
          <button type="submit">Time Out</button>
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
  name: 'TimeOut',
  props: {
    show: Boolean,
  },
  data()
  {
    return {
      days: '',
      hours: '',
      minutes: '',
      seconds: '',
      matrixError: [
                'allright',
                'Should be between 10 seconds and 30 days',
                'Should be numbers',
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
    notGoodAmount()
    {
        this.matrixIndex = 1;
    },
    goodRequest()
    {
        this.close();
    },
    resetData()
    {
        this.days = '' ;
        this.hours = '' ;
        this.minutes = '' ;
        this.seconds = '' ;
        this.matrixIndex = 0;
    },
    timeoutUser()
    {
        const nDays = +this.days;
        const nHours = +this.hours;
        const nMinutes = +this.minutes;
        const nSeconds = +this.seconds;

        if (isNaN(nDays) || isNaN(nHours) || isNaN(nMinutes) || isNaN(nSeconds))
            this.matrixIndex = 2;
        const totalSeconds = (nDays * 24 * 3600) + (nHours * 3600) + (nMinutes * 60) + nSeconds;
        this.$emit('timeout-user', totalSeconds);
    },
  },
};
</script>
  
<style>

.input-time
{
  display: flex;
  flex-direction: inline;
}
.input-time input
{
    width: 1.2em;
}
</style>
  