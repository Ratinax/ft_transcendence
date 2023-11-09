<template>
	<div class="inputZone">
			<p class="error">{{ error }}</p>
			<form @submit.prevent="login">
				<input type="text" placeholder="Username" :class="{'input-error': error !== ''}" v-model="pseudo" />
			</form>
			<form @submit.prevent="login">
				<input type="password" placeholder="Password" :class="{'input-error': error !== ''}" v-model="password"/>
			</form>
			
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
		const error = ref("");
		
		async function login42()
		{
			const link = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_REDIRECT_URI}&response_type=code`;
			window.location.href = link;
		}
		function	resetData() {
			error.value = '';
			pseudo.value = "";
			password.value = "";
		}
		async function login()
		{
			error.value = '';
			let res;
			try
			{
				res = await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/signin`, 
				{ 
					pseudo: pseudo.value,
					password: password.value,
				},
				{
					withCredentials: true,
				},
				)
			}
			catch (e: any)
			{
				if (e && e.request && e.request.response)
					error.value = JSON.parse(e.request.response).message;
				else
					error.value = 'Internal servor error, try again later';
				return ;
			}
			if (!res.data)
				return ;
			if (res.data !== true)
				router.push({name: 'DoubleFaPage', params: {link: res.data}})
			else
				router.push({name: 'UserPage', params: {pseudo: pseudo.value}});
			resetData();
		}
		return {login, login42, resetData, pseudo, password, error};
	}
});
</script>

<style scoped src="../../assets/formComponent.css" lang="css">

</style>
