<template>
  <div>
    <!-- <QRCode :value="link" :size="128"></qrcode> -->
      <img :src="qrlink"/>
			<form  @submit.prevent="check2Fa">
        <input v-model="code" placeholder="Verification Code"/>
      </form>
      <div id="loader"></div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
// import QRCode from 'qrcode.vue';
import qrcode from 'qrcode';
import axios from 'axios';

export default {
    name: "DoubleFa",
    components: {
      // QRCode,
    },
    props: {
    },
    data() {
      return {
        route: useRoute(),
        router: useRouter(),
        qrlink: '',
        code: '',
        timeLeft: Number,
      }
    },
    mounted()
    {
      this.timeLeft = 30;
      const timeLeft = JSON.parse(localStorage.getItem('timeLeft'));
      if (timeLeft && timeLeft > 0)
        this.timeLeft = timeLeft;
      qrcode.toDataURL(this.route.params.link, (err, data) =>
      {
        if (err)
          console.error(err)
        else
          this.qrlink = data;
      })
      
      setInterval(() => {
          this.pingTimeLeft();
      }, 1000);
    },
    methods:
    {
      async check2Fa()
      {
        try
        {

          const res = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/verify2Fa/${this.code}`, {withCredentials: true})).data;
          if (res === true)
            this.router.replace({path: '/chat'});
          else
          {
            this.router.replace({path: '/'})
          }
        }
        catch (e)
        {
          console.error('la ya une error :', e);
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
                    #ffffff ${(30 - this.timeLeft) * 3.333}%,
                    #ffffff 100%`

              localStorage.setItem('timeLeft', JSON.stringify(this.timeLeft));
              if (res < 0)
              {
                localStorage.setItem('timeLeft', JSON.stringify(0));
                this.router.replace({path: '/'})
              }
            }
            catch (e)
            {
              console.error(e);
            }
        }, 1000)
      }
    }
}
</script>

<style scoped>

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

