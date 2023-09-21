<template>
	<div @click.self="close" class="modal-overlay" v-if="show">
		<div class="modal input-container">
			<input v-model="channelName" placeholder="Channel name"/>
			<div class="radio-container">
				<div v-for="category in categories" :key="category.id" class="radio-item">
					<input 
						type="radio" 
						:id="category.id + ''" 
						:value="category.id" 
						v-model="selectedCategory"/>
					<label :for="category.id + ''">{{ category.name }}</label>
				</div>
			</div>
			<input v-if="selectedCategory === 3" v-model="password" placeholder="Password" type="password"/>
			<p v-if="matrixIndex > 0" class="error"> {{ matrixError[matrixIndex] }}</p>
			<form class="buttons" @submit.prevent="createChannel">
				<button class="ft-button" type="submit">Create</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'CreateChannel',
	props: {
		show: Boolean,
		socket: Socket,
		sessionCookie: String,
	},
	data()
	{
		return {
			selectedCategory: 0 as number,
			categories: [
				{ id: 1, name: 'Public'}, 
				{ id: 2, name: 'Private'}, 
				{ id: 3, name: 'Protected by password'}, 
			],
			matrixIndex: 0,
			matrixError: [
				'allright',
				'You must not have an empty field',
				'Channel name and password must be between 3 and 20 caracteres',
				'Channel already exists',
			],
			password: '',
			channelName: '',
		}
	},
	mounted()
	{
		if (this.socket)
		{

			this.socket.on('createGoodRequest', async (response: {sessionCookie: string}) => {
				if (response.sessionCookie === this.sessionCookie)
					this.goodRequest();
			});
			this.socket.on('createAlreadyExists', async (response: {sessionCookie: string}) => {
				if (response.sessionCookie === this.sessionCookie)
					this.alreadyExists();
			});
			this.socket.on('createPasswordOrNameWrongSize', async (response: {sessionCookie: string}) => {
				if (response.sessionCookie === this.sessionCookie)
					this.wrongInputLength();

			});
			this.socket.on('createWrongCategory', async (response: {sessionCookie: string}) => {
				if (response.sessionCookie === this.sessionCookie)
					this.wrongCategory();

			});
		}
	},
	methods: 
	{
		async createChannel()
		{
			if (this.socket)
				this.socket.emit('createChannel', { channel: {
					name: this.channelName,
					password: this.password,
					category: this.categories[(this.selectedCategory) - 1].name,
					isADm: false,
					},
					sessionCookie: this.sessionCookie});
		},
	close()
		{
			this.resetData();
			this.$emit('close');
		},
		resetData()
		{
			this.password = '';
			this.channelName = '';
			this.selectedCategory = 0;
			this.matrixIndex = 0;
		},
		goodRequest()
		{
			this.close();
		},
		wrongCategory()
		{
			this.matrixIndex = 1;
		},
		wrongInputLength()
		{
			this.matrixIndex = 2;
		},
		alreadyExists()
		{
			this.matrixIndex = 3;
		},
	}
});
</script>

<style scoped src="../../assets/popup.css">

</style>
