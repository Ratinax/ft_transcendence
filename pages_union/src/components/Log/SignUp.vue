<template>
	<form class="col" @submit.prevent="register">
			<input type="text" placeholder="Username" v-model="pseudo" />
			<input type="password" placeholder="Password" v-model="password" />
			<input type="password" placeholder="Repeat Password" v-model="passwordCheck" />
		<div v-if="matrixIndex > 0">
			<p class="error">{{ matrixError[matrixIndex] }}</p>
		</div>
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
		let matrixError: Array<string> = [
			'allright',
			'Passwords do not match',
			'Password should be between 8 and 20 caracteres',
			'Login should be between 3 and 8 caracteres',
			'You must not have an empty field',
			'User already exists',
			'Bad File Format (required .png .jpg)',
			'File too large, must be 50mb max',
		];
		const matrixIndex =  ref(0);
		let imageDataURL: any = "";
		const router = useRouter();
		const imageInput = ref<HTMLInputElement | null>(null);

		function	handleInputErrors() {
			matrixIndex.value = 0;
			if (password.value !== passwordCheck.value)
			matrixIndex.value = 1;
			if (password.value.length < 8
				|| password.value.length > 20)
			matrixIndex.value = 2;
			if (pseudo.value.length < 3
				|| pseudo.value.length > 8)
			matrixIndex.value = 3;
			if (pseudo.value === ''
				|| password.value === ''
				|| passwordCheck.value === '')
			matrixIndex.value = 4;
		}

		function	resetData() {
			pseudo.value = "";
			passwordCheck.value = "";
			password.value = "";
		}

		async function	register() {
			handleInputErrors();
			if (matrixIndex.value > 0)
				return ;
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/users/signup`, 
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
				if (e && e.reponse && e.response.status === 413)
					matrixIndex.value = 7;
				else
					matrixIndex.value = 5;
				return ;
			}
			resetData();
			router.push({path: '/chat'});
		}

		function	chooseImage() {
			imageInput.value?.click();
		}

		function	onImageSelect(event: any) {
			const file = event.target.files[0];
			if (!(file.type === 'image/png' 
				|| file.type === 'image/jpeg'
				|| file.type === 'image/jpg'))
			{
				matrixIndex.value = 6;
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
			matrixError,
			matrixIndex,
			imageDataURL,
			imageInput,
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
