<template>
	<div @click.self="close" class="modal-overlay" v-if="show">
		<div class="modal">
			<form class="input-container" @submit.prevent="setPassword">
				<div class="buttons">
					
				</div>
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
							Set Pw
						</span>
						<span v-else>
							Change Pw
						</span>
					</button>
					<button v-if="isSet || isPrivate" @click.prevent="goPublic" class="ft-button">
						go public
					</button>
					<button v-if="!isPrivate" id="go-private" class="ft-button" @click.prevent="goPrivate">
							go private
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
		isPrivate: Boolean,
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
		goPublic() {
			this.$emit('go-public');
		},
		goPrivate()
		{
			this.$emit('go-private');
		}
	},
});
</script>

<style scoped src="../../assets/popup.css">
#go-private
{
	margin-top: 1em;
}
</style>

