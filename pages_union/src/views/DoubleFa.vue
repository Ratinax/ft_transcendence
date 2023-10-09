<template>
	<div class="page-background"></div>
  <div class="test">
      <img :src="qrlink"/>
			<form  @submit.prevent="check2Fa">
        <div class="input-numbers">
            <input ref="digit1" v-model="digit1" placeholder="0" type="text" @keypress="handleKeyPressed(1)"/>
            <input ref="digit2" v-model="digit2" placeholder="0" type="text" @keypress="handleKeyPressed(2)"/>
            <input ref="digit3" v-model="digit3" placeholder="0" type="text" @keypress="handleKeyPressed(3)"/>
            <input ref="digit4" v-model="digit4" placeholder="0" type="text" @keypress="handleKeyPressed(4)"/>
            <input ref="digit5" v-model="digit5" placeholder="0" type="text" @keypress="handleKeyPressed(5)"/>
            <input ref="digit6" v-model="digit6" placeholder="0" type="text" @keypress="handleKeyPressed(6)"/>
        </div>
        <button class="invisible" type="submit"></button>
      </form>
      <div id="loader"></div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import qrcode from 'qrcode';
import axios from 'axios';

export default {
    name: "DoubleFa",
    props: {
    },
    data() {
      return {
        route: useRoute(),
        router: useRouter(),
        qrlink: '',
        timeLeft: Number,
        interValId: null,
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: '',
        digit6: '',
      }
    },
    mounted()
    {
      this.timeLeft = 30;
      const timeLeft = JSON.parse(localStorage.getItem('timeLeft'));
      if (timeLeft && timeLeft > 0)
        this.timeLeft = timeLeft;
      else if (timeLeft !== 0 || timeLeft === -1)
        localStorage.setItem('timeLeft', JSON.stringify(30));

      qrcode.toDataURL(this.route.params.link, (err, data) =>
      {
        if (err)
          console.error(err)
        else
          this.qrlink = data;
      })
      
      this.interValId = setInterval(() => {
          this.pingTimeLeft();
      }, 1000);
    },
    methods:
    {
      handleKeyPressed(nb)
      {
        if (nb === 1 && this.$refs.digit1 && this.$refs.digit2)
        {
          this.$refs.digit1.select();
          this.$refs.digit2.select();
        }
        else if (nb === 2 && this.$refs.digit2 && this.$refs.digit3)
        {
          this.$refs.digit2.select();
          this.$refs.digit3.select();
        }
        else if (nb === 3 && this.$refs.digit4 && this.$refs.digit3)
        {
          this.$refs.digit3.select();
          this.$refs.digit4.select();
        }
        else if (nb === 4 && this.$refs.digit4 && this.$refs.digit5)
        {
          this.$refs.digit4.select();
          this.$refs.digit5.select();
        }
        else if (nb === 5 && this.$refs.digit6 && this.$refs.digit5)
        {
          this.$refs.digit5.select();
          this.$refs.digit6.select();
        }
        else if (nb === 6 && this.$refs.digit6)
        {
          this.$refs.digit6.select();
          this.$refs.digit6.blur();
        }
      },
      async check2Fa()
      {
        const code = this.getCode(); 
        try
        {

          const res = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/verify2Fa/${code}`, {withCredentials: true})).data;
          if (res === true)
          {
            localStorage.setItem('timeLeft', JSON.stringify(0));
            clearInterval(this.interValId);
            this.router.replace({path: '/chat'});
          }
          else
          {
            localStorage.setItem('timeLeft', JSON.stringify(0));
            clearInterval(this.interValId);
            this.router.replace({path: '/'})
          }
        }
        catch (e)
        {
          console.error('Error :', e);
        }
      },
      async pingTimeLeft()
      {
        setTimeout(async () => 
        {
            try
            {
              const res = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/timeLeft2Fa/`, {withCredentials: true})).data;
              this.timeLeft--;
              const loader = document.getElementById('loader');
              if (loader)
                loader.style.background = `conic-gradient(
                    transparent 0%,
                    transparent ${(30 - this.timeLeft) * 3.333}%,
                    #c5c6c7 ${(30 - this.timeLeft) * 3.333}%,
                    #c5c6c7 100%`
              const timeLeft = JSON.parse(localStorage.getItem('timeLeft'));
              if (timeLeft > 0)
                localStorage.setItem('timeLeft', JSON.stringify(this.timeLeft));
              if (res < 0)
              {
                localStorage.setItem('timeLeft', JSON.stringify(0));
                clearInterval(this.interValId);
                this.router.replace({path: '/'})
              }
            }
            catch (e)
            {
              console.error(e);
            }
        }, 1000)
      },
      getCode()
      {
        let res = '';
        if (this.digit1 === '')
          res += '0';
        else
          res += this.digit1;
        if (this.digit2 === '')
          res += '0';
        else
          res += this.digit2;
        if (this.digit3 === '')
          res += '0';
        else
          res += this.digit3;
        if (this.digit4 === '')
          res += '0';
        else
          res += this.digit4;
        if (this.digit5 === '')
          res += '0';
        else
          res += this.digit5;
        if (this.digit6 === '')
          res += '0';
        else
          res += this.digit6;
        return (res);
      }
    }
}
</script>

<style scoped>
.invisible
{
  display: none;
}
.input-numbers
{
  display: flex;
  justify-content: center;
  margin-top: 20em;
}
.input-numbers input
{
    box-shadow: 0 4px 0 grey;
    width: 2em;
    height: 2em;
    font-size: 1.5em;
    border-radius: 10%;
    text-align: center;
    margin: 0.25em;
}
.input-numbers input:focus
{
  box-shadow: 0 4px 0 var(--pblue);
}

.page-background
{
  z-index: -1;
}

#time-left-2fa
{
  color: var(--plight);
}

#loader {
  width: 5em;
  height: 5em;
  border-radius: 50%;
}
</style>

