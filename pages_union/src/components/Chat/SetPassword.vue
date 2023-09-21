<template>
	<div @click.self="close" class="modal-overlay" v-if="show">
		<div class="modal">
			<form class="input-container" @submit.prevent="setPassword">
				<input 
					v-model="password" 
					placeholder="Password" 
				type="password"/>
				<input 
					v-model="passwordCheck" 
					placeholder="Repeat password" 
				type="password"/>
				<p v-if="matrixIndex > 0" class="error">{{ matrixError[matrixIndex] }}</p>
				<div class="buttons">
					<button 
						class="ft-button" 
						type="submit">
						<span v-if="!isSet">
							Set
						</span>
						<span v-else>
							Change
						</span>
					</button>
					<button @click.prevent="removePassword" class="ft-button">
						remove
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SetPassword',
	props: {
		show: Boolean,
		isSet: Boolean,
	},
	data()
{
		return {
			password: '',
			passwordCheck: '',
			matrixError: [
				'allright',
				'Passwords do not match',
				'Password must be between 3 and 20 characters'
			],
			matrixIndex: 0,
		}
	},
	methods: 
	{
		close()
		{
			this.resetData();
			this.$emit('close');
		},
		notGoodLength()
		{
			this.matrixIndex = 2;
		},
		goodRequest()
		{
			this.close();
		},
		resetData()
		{
			this.password = '';
			this.passwordCheck = '';
			this.matrixIndex = 0;
		},
		setPassword()
		{
			if (this.password !== this.passwordCheck)
			{
				this.matrixIndex = 1;
				return ;
			}
			if (this.isSet) {
				this.$emit('change-password', this.password);
			}
			else {
				this.$emit('set-password', this.password);
			}
		},
		removePassword() {
			this.$emit('remove-password');
		}
	},
});
</script>

<style scoped src="../../assets/popup.css">

</style>

