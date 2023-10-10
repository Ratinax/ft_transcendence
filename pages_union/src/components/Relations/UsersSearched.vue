<template>
	<Transition name="showUserSearchResult">
		<div v-if="show" class="users-searched-container"> 
			<div class="row user-searched" v-for="user in listUsersSearched" :key="user.id" @click="goToProfil(user)" >
				<div class="circle">
					<img :src="user.profilPic" >
				</div>
				<p class="text user-searched-pseudo">{{ user.pseudo }}</p>
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
			const regex = /^[A-Za-z0-9_.-]+$/;
			if (!regex.test(this.pseudo ? this.pseudo : ''))
			{
				this.$emit('displayError', 'Should only contains A-Z, a-z, 0-9, and \'._-\'');
				return ;
			}
				
			this.listUsersSearched = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/users/${this.pseudo}`, {withCredentials: true})).data;
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
	transition: all 0.42s ease;
}


.showUserSearchResult-enter-from,
.showUserSearchResult-leave-to {
	transform: translateY(-15px);
	opacity: 0;
}

.users-searched-container {
	z-index: 3;
	position: absolute;
	top: 7.42em;
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

.user-searched:hover .user-searched-pseudo {
	color: var(--pcyan);
}

.user-searched:hover .circle {
	transform: scale(103%);
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

.circle {
	border-radius: 50%;
	display: flex;
	overflow: hidden;
	justify-content: center;
	width: 3em;
	height: 3em;
	transition: transform 100ms ease;
}

@media screen and (max-width: 500px) {
	.users-searched-container {
		width: 20em;
	}
}

</style>
