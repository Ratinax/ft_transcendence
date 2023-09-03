<template>
    <router-view></router-view>
</template>

<script>
import { io } from 'socket.io-client';
import axios from 'axios';


export default {
  name: 'App',
  components: {
  },
  data()
  {
    return {
      socket: io(`http://${process.env.VUE_APP_IP}:3003/`, { withCredentials: true }),
    }
  },
  mounted()
  {
    this.socket.on('pingAlive', async () => {
      await axios.post(`http://${process.env.VUE_APP_IP}:3000/sessions/pingBack`, {}, { withCredentials: true });
    })
  }
}
</script>

<style src="./assets/global.css" rel="stylesheet" lang="css"></style>
<style>
.modal
{
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-overlay 
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.circle 
{
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin-left: 1em;
  flex-shrink: 0;
  justify-content: center;
  text-align: center;
}
.green
{
  background-color: green;
}
.red
{
  background-color: red;
}

</style>
