<template>
    <div class="pop-up-overlay" v-if="show" @click.self="close">
      <div class="pop-up">
        <div v-if="matrixIndex > 0">
            <p class="error">{{ matrixError[matrixIndex] }}</p>
        </div>
        <form @submit.prevent="timeoutUser">
          <div class="input-time">
            <input v-model="days" placeholder="0d" type="text"/>
            <input v-model="hours" placeholder="0h" type="text"/>
            <input v-model="minutes" placeholder="0m" type="text"/>
              <input v-model="seconds" placeholder="0s" type="text"/>
          </div>
          <button class="timeout-button" type="submit"></button>
        </form>
      </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
});
</script>
  
<style scoped>

.error
{
  color: red;
}
.pop-up
{
  width: 15%;
}
.timeout-button
{
  display: none;
}

.input-time
{
  display: flex;
  justify-content: center;
}
.input-time input
{
    box-shadow: 0 4px 0 grey;
    width: 2em;
    height: 2em;
    font-size: 1.5em;
    border-radius: 10%;
    text-align: center;
    margin: 0.25em;
}
.input-time input:focus
{
    box-shadow: 0 4px 0 var(--pblue);
}
</style>
  