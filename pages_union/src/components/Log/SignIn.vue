<template>
	<div class="inputZone">
			<input type="text" placeholder="Username" v-model="pseudo" />
			<input type="password" placeholder="Password" v-model="password"/>
			<div class="row buttonZone">
			<form @submit.prevent="login42">
				<button class="row ft-button" type="submit">
					<img src="../../assets/42_logo.svg" alt="logo 42">
						LOGIN
				</button>
			</form>
			<form @submit.prevent="login">
				<button class="ft-button" type="submit">
					LOGIN
				</button>
			</form>
			</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';


export default defineComponent({
	setup() 
	{
		const pseudo = ref("");
		const password = ref("");
		const router = useRouter();
		
		async function login42()
		{
			const link = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_REDIRECT_URI}&response_type=code`;
			window.location.href = link;
		}
		function	resetData() {
			pseudo.value = "";
			password.value = "";
		}
		async function login()
		{
			let res;
			try
			{
				res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/users/signin`, 
				{ 
					pseudo: pseudo.value,
					password: password.value,
				},
				{
					withCredentials: true,
				},
				)
			}
			catch (e)
			{
				console.error(e);
				return ;
			}
			if (!res.data)
			{
				// TODO handle error not good password nor user
				return ;
			}
			resetData();
			router.push({path: '/chat'});
		}
		return {login, login42, resetData, pseudo, password};
	}
});
</script>

<style scoped src="../../assets/formComponent.css" lang="css">

</style>
