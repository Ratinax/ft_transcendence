<template>
	<Transition name="showUserSearchResult">
		<div v-if="show" class="users-searched-container"> 
			<div class="row user-searched" v-for="user in listUsersSearched" :key="user.id">
			<div class="circle" @click="goToProfil(user)">
				<img :src="user.profilPic" >
			</div>
			<p @click="goToProfil(user)" class="text user-searched-pseudo">{{ user.pseudo }}</p>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import axios from 'axios';
import { useRouter } from "vue-router";

export default defineComponent({
	name: 'UsersSearched',
	props:
	{
		pseudo: String,
		show: Boolean,
	},
	data()
{
		return {
			router: useRouter(),
			listUsersSearched: [] as Array<{id: number, pseudo: string, profilPic: string, is42User: boolean}>,
		}
	},
	methods:
	{
		async searchUsers()
		{
			console.log('da', this.pseudo); // to remove
			this.listUsersSearched = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/users/${this.pseudo}`, {withCredentials: true})).data;
			if (this.listUsersSearched) {
				if (this.listUsersSearched.length > 0) {
					this.$emit('displaySearch');
				}
				else {
					this.$emit('displayError', 'No user(s) found.');
				}
			}
		},
		goToProfil(user: {id: number, pseudo: string, profilPic: string, is42User: boolean})
		{
			this.router.push({name: 'UserPage', params: {pseudo: user.pseudo}})
		},
		handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				this.$emit('close');
			}
		}
	},
	mounted() {
		window.addEventListener('keydown', this.handleKeyDown);
	},
	beforeUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}
});
</script>

<style scoped>

.showUserSearchResult-enter-active,
.showUserSearchResult-leave-active {
	transition: all .42s ease;
}


.showUserSearchResult-enter-from,
.showUserSearchResult-leave-to {
	opacity: 0;
	transform : translateY(-10px);
}

.users-searched-container {
	position: absolute;
	top: 6em;
	border-radius: .5em;
	padding: 1em 0;
	width: 30em;
	background: var(--pdark);
	max-height: 460px;
	overflow: auto;
	box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.user-searched {
	align-items: center;
	padding: 1em;
}

.user-searched > .user-searched {
	margin-top: 1em;
}

.user-searched:hover {
	cursor: pointer;
	background: #151d26;
}

.user-searched-pseudo {
	margin-left: .9em;
	font-size: 1.25em;
	transition: color 0.2s ease;
	overflow: hidden;
	text-overflow: ellipsis;
}

.user-searched-pseudo:hover {
	color: var(--pcyan);
	cursor: pointer;
}

.circle {
	border-radius: 50%;
	display: flex;
	overflow: hidden;
	justify-content: center;
	width: 3em;
	height: 3em;
	transition: transform 100ms ease;
}

.circle:hover {
	transform: scale(102%);
	cursor: pointer;
}

@media screen and (max-width: 500px) {
	.users-searched-container {
		width: 20em;
	}
}

</style>
