<template>
    <div class="row user-container">
        <div class="round-image-container">
            <img :src="profilPic" alt="Image" @click.prevent="goToProfil"/>
        </div>
        <span class="user-pseudo text" @click.prevent="goToProfil"> {{ user?.pseudo }}</span>
		<div class="user-buttons">
			<button @click.prevent="accept" v-if="isARequest" class="ft-button green-button">
				<font-awesome-icon icon="fa-solid fa-check" />
			</button>
			<button @click.prevent="remove" class="ft-button red-button">
				<font-awesome-icon icon="fa-solid fa-xmark" />
			</button>
		</div>
	</div>
</template>

<script lang="ts">

import axios from 'axios';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'User-Component',
	props: 
	{
		user: Object,
		isARequest: Boolean,
	},
	data()
{
		return {
			profilPic: '',
			router: useRouter(),
		}
	},
	async mounted()
	{
		this.profilPic = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/imageNameByPseudo/${this.user?.pseudo}`, {withCredentials: true})).data;
	},
	methods: 
	{
		accept()
		{
			this.$emit('accept-friendship', this.user?.id);
		},
		remove()
		{
			this.$emit('remove-relation', this.user?.id);
		},
		goToProfil()
		{
			this.router.push({name: 'UserPage', params: {pseudo: this.user?.pseudo}})
		}
	}
});
</script>

<style scoped>

.user-container {
	width: 95%;
	align-items: center;
	transition: background 200ms ease;
	padding: .42em;
	border-radius: .5em;
}

.user-container:hover {
	background: var(--pdark);
}

.round-image-container {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	height: 3.5em;
	width: 3.5em;
	min-width: 3.5em;
}

.round-image-container > img:hover {
	cursor: pointer;
}

.user-pseudo {
	font-size: 1.3em;
	margin-left: 1em;
	transition: color 150ms ease;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: margin-left 200ms ease;
}

.user-pseudo:hover {
	cursor: pointer;
	color: var(--pcyan);
}

.user-buttons {
	margin-left: auto;
	display: flex;
}

.user-buttons > .ft-button {
	margin-left: .5em;
}

.ft-button {
	transition: font-size 200ms ease;
}

@media screen and (max-width: 500px) {
	.user-pseudo {
		margin-left: 0.442rem;
		width: 42%;
	}	

	.user-buttons > .ft-button {
		font-size: 1rem;
	}
}

@media screen and (max-width: 360px) {
	.user-pseudo {
		max-width: 110px;
	}
}

</style>
