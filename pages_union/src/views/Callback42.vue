<template>
  <div></div>
</template>

<script>

import axios from 'axios';

export default {
    name: 'Callback42Vue',
    data()
    {
        return {
            code: null,
        }
    },
    async created()
    {
        this.code = this.$route.query.code;
        const res = await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/callback42/${this.code}`,
				{
					withCredentials: true,
				},
				);
        if (res.data)
        {
            this.$router.replace({path: '/chat'})
        }
        console.log(res.data)
    }
}
</script>

<style>

</style>