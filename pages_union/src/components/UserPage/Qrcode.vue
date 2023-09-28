<template>
    <div v-if="show" @click.self="close" class="modal-overlay">
        <div class="modal">
            <img :src="qrlink"/>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue"
import axios from 'axios';
import qrcode from 'qrcode';

export default defineComponent({
    name: 'Qrcode-component',
    props:
    {
        show: Boolean,
    },
    data()
    {
        return {
            qrlink: '',
        }
    },
    methods:
    {
        async getQrCode()
        {
            const res = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/link2Fa`, {withCredentials: true})).data;
            console.log(res);
            qrcode.toDataURL(res, (err: any, data: string) =>
            {
                if (err)
                    console.error(err)
                else
                    this.qrlink = data;
            })

        },
        close()
        {
            this.$emit('close');
        },
    }
});
</script>

<style scoped>
.modal
{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 11em;
    height: 11em;
}
</style>