<template>
	<div class="inputZone">
		<form @submit.prevent="register">
			<input type="text" placeholder="Username" v-model="pseudo" />
			<input type="password" placeholder="Password" v-model="password" />
			<input type="password" placeholder="Repeat Password" v-model="passwordCheck" />
			<div class="buttonZone">
				<button type="button" @click="chooseImage">CHOOSE PROFILE PIC</button>
				<input type="file" accept="image/*" ref="imageInput" style="display: none" @change="onImageSelect" />
				<button type="submit">REGISTER</button>
			</div>
		</form>
		<div v-if="matrixIndex > 0">
            <p class="error">{{ matrixError[matrixIndex] }}</p>
        </div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'

export default defineComponent({
	setup() {
		let pseudo: string = "";
		let passwordCheck: string = "";
		let password: string = "";
		let matrixError: Array<String> = [
			'allright',
			'Passwords do not match',
			'Password should be between 8 and 20 caracteres',
			'Login should be between 3 and 8 caracteres',
			'You must not have an empty field',
			'User already exists',
			'Bad File Format (required .png .jpg)',
			'File too large, must be 50mb max',
		];
		let matrixIndex: number = 0;
		let imageDataURL: any = "";
		const router = useRouter();
		const imageInput = ref<HTMLInputElement>();

		function	handleInputErrors() {
			matrixIndex = 0;
			if (password !== passwordCheck)
			matrixIndex = 1;
			if (password.length < 8
				|| password.length > 20)
			matrixIndex = 2;
			if (pseudo.length < 3
				|| pseudo.length > 8)
			matrixIndex = 3;
			if (pseudo === ''
				|| password === ''
				|| passwordCheck === '')
			matrixIndex = 4;
		}

		function	resetData() {
			pseudo = "";
			passwordCheck = "";
			password = "";
		}

		async function	register() {
			handleInputErrors();
			if (matrixIndex > 0)
			return ;
			try 
			{
				const res = await axios.post('http://localhost:3000/users/signup', { 
					pseudo: pseudo,
					password: password,
					isConnected: true,
					image: imageDataURL });
				console.log('res :', res);
			}
			catch(e: any)
			{
				console.error('Error registering user:', e);
				console.log(e);
				if (e.response.status === 413)
				matrixIndex = 7;
				else
				matrixIndex = 5;
				return ;
			}
			resetData();
			router.push('/');
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
				matrixIndex = 6;
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
			handleInputErrors,
			register,
			chooseImage,
			onImageSelect,
		};
	}
});
</script>


<style src="../assets/formComponent.css" lang="css">

</style>
