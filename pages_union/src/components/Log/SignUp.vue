<template>
	<form class="col" @submit.prevent="register">
		<p class="error">{{ error }}</p>
		<input type="text" placeholder="Username" :class="{'input-error': error === 'Login should be between 3 and 8 caracteres' || (pseudo === '' && error !== '')}" v-model="pseudo" />
		<input type="password" placeholder="Password" :class="{'input-error': error === 'Password should be between 8 and 20 caracteres' || (password === '' && error !== '')}" v-model="password" />
		<input type="password" placeholder="Repeat Password" :class="{'input-error': error === 'Passwords do not match' || (passwordCheck === '' && error !== '')}" v-model="passwordCheck" />
		<div class="row buttonZone">
			<button class="ft-button" type="button" @click="chooseImage">CHOOSE PROFILE PIC</button>
			<input type="file" accept="image/*" ref="imageInput" style="display: none" @change="onImageSelect" />
			<button class="ft-button" type="submit">REGISTER</button>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
	setup() {
		const pseudo = ref("");
		const passwordCheck = ref("");
		const password = ref("");
		const error = ref("");
		let imageDataURL: any = "";
		const router = useRouter();
		const imageInput = ref<HTMLInputElement | null>(null);

		function	handleInputErrors() {
			if (password.value !== passwordCheck.value)
				error.value = 'Passwords do not match';
			if (password.value === '' || passwordCheck.value === '' || pseudo.value === '')
				error.value = 'You must not have an empty field';
		}

		function	resetData() {
			pseudo.value = "";
			passwordCheck.value = "";
			password.value = "";
		}

		async function	register() {
			error.value = "";
			handleInputErrors();
			if (error.value !== '')
			{
				return ;
			}
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:3000/users/signup`, 
				{ 
					pseudo: pseudo.value,
					password: password.value,
					image: imageDataURL ,
				},
				{
					withCredentials: true,
				},
				)
			}
			catch(e: any)
			{
				if (e && e.request && e.request.response)
					error.value = JSON.parse(e.request.response).message;
				else
					error.value = 'Internal servor error, try again later';
				return ;
			}
			router.push({name: 'UserPage', params: {pseudo: pseudo.value}});
			resetData();
		}

		function	chooseImage() {
			imageInput.value?.click();
		}

		function	onImageSelect(event: any) {
			if (error.value === "Bad File Format (required .png .jpg), will be replaced by a default one"
				|| error.value === 'File too large, must be 50mb max, will be replaced by a default one')
				error.value = '';
			const file = event.target.files[0];
			if (!(file.type === 'image/png' 
				|| file.type === 'image/jpeg'
				|| file.type === 'image/jpg'))
			{
				error.value = 'Bad File Format (required .png .jpg), will be replaced by a default one';
				imageDataURL = null;
				return ;
			}
			if (file.size > 50000000)
			{
				error.value = 'File too large, must be 50mb max, will be replaced by a default one';
				imageDataURL = null;
				return ;
			}
			
			if (file) {
				const reader = new FileReader();
				reader.onload = () => {
					imageDataURL = reader.result;
				};
				reader.readAsDataURL(file);
			}
		}

		return {
			pseudo,
			passwordCheck,
			password,
			imageDataURL,
			imageInput,
			error,
			handleInputErrors,
			register,
			chooseImage,
			onImageSelect,
		};
	}
});
</script>

<style scoped src="../../assets/formComponent.css" lang="css">

</style>

<style scoped>

@media screen and (max-width: 460px){
	button {
		margin: 0 .25em;
	}
}

</style>
