<template>
  <div>
    <!-- <QRCode :value="link" :size="128"></qrcode> -->
      <img :src="qrlink"/>
			<form  @submit.prevent="check2Fa">
        <input v-model="code" placeholder="Verification Code"/>
      </form>
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
      }
    },
    mounted()
    {
      qrcode.toDataURL(this.route.params.link, (err, data) =>
      {
        if (err)
          console.error(err)
        else
          this.qrlink = data;
      })
    },
    methods:
    {
      async check2Fa()
      {
        // console.log(this.code);
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
      }
    }
}
</script>

<style>

.test
{
  margin-left: 30em;
  margin-top: 30em;
}
</style>

