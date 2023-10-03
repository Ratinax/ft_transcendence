<template>
  <div class="reset">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script>

import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'Callback42Vue',
    data()
    {
        return {
            code: null,
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
        catch (error)
        {
			if (error && error.response && error.response.data && error.response.data.message)
                this.errorMessage = error.response.data.message;
            else
                this.errorMessage = 'Internal servor error, try again later';
        }
    }
}
</script>

<style scoped>
p
{
    color: white;
}
</style>