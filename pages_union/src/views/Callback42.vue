<template>
  <div class="reset">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">

import axios from 'axios';
import { defineComponent } from 'vue';
import { LocationQueryValue, useRouter } from 'vue-router';

export default defineComponent({
    name: 'Callback42Vue',
    data()
    {
        return {
            code: '' as LocationQueryValue | LocationQueryValue[] | string,
            errorMessage: '',
            router: useRouter(),
        }
    },
    async created()
    {
        this.code = this.$route.query.code;

        try
        {

            const res = await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/callback42/${this.code}`,
            {
                withCredentials: true,
            },
            );
            if (!res.data)
				return ;
			if (res.data !== true)
				this.router.replace({name: 'DoubleFaPage', params: {link: res.data}})
			else
				this.router.replace({path: '/chat'});
        }
        catch (error: any)
        {
			if (error && error.response && error.response.data && error.response.data.message)
                this.errorMessage = error.response.data.message;
            else
                this.errorMessage = 'Internal servor error, try again later';
        }
    }
})
</script>

<style scoped>
p
{
    color: white;
}
</style>