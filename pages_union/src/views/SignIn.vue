<template>
	<div class="inputZone">
		<form @submit.prevent="login42">
			<input class="register-input" type="text" placeholder="Username" v-model="pseudo" />
			<input class="register-input" type="password" placeholder="Password" v-model="password"/>
			<div class="buttonZone">
				<button class="register-button" type="submit">
					<img src="../assets/42_logo.svg" alt="logo 42">
						LOGIN
				</button>
				<button type="submit" class="register-button">
					LOGIN
				</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	setup() 
	{
		const pseudo = ref("");
		const password = ref("");

		function login42()
		{
			const link = `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.VUE_APP_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_REDIRECT_URI}&response_type=code`;
			console.log(link);
			window.location.href = link;
		}

		return {login42, pseudo, password};
	}
});
</script>

<style src="../assets/formComponent.css" lang="css">

</style>
