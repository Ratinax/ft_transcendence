<template>
	<div v-if="show" @click.self="close" class="pop-up-overlay">
		<div class="pop-up list-users-banned">
			<div class="all-user" v-for="user in listUsersBanned" :key="user.id">
				<div class="user-banned" @click="goToProfil(user)">
					<div class="circle">
						<img :src="user.profilPic">
					</div>
					<p class="user-banned-pseudo">{{ user.nickname }} @{{ user.pseudo }}</p>
					<font-awesome-icon class="cross-icon" :icon="['fas', 'xmark']" @click.prevent="removeFromBan(user)"/>
				</div>
			</div>
			<p v-if="showErrorMessage" class="text-error">No users banned.</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import axios from 'axios';
import { useRouter } from "vue-router";

export default defineComponent({
	name: 'UsersBanned',
	props:
	{
		channel: Object,
		show: Boolean,
	},
	data()
{
		return {
			router: useRouter(),
			listUsersBanned: [] as Array<{id: number, pseudo: string, nickname: string, profilPic: string, is42User: boolean}>,
			isClickREmoveFromBan: false,
			showErrorMessage: false,
		}
	},
	methods:
	{
		async getBannedUsers()
	{
			this.listUsersBanned = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels_users/bannedUsers/${this.channel?.channel_id}`, {withCredentials: true})).data;
			this.listUsersBanned.length > 0 ? this.showErrorMessage = false: this.showErrorMessage = true;
		},
		close()
	{
			this.$emit('close');
		},
		goToProfil(user: {id: number, pseudo: string, profilPic: string, is42User: boolean})
	{
			if (!this.isClickREmoveFromBan)
			this.router.push({name: 'UserPage', params: {pseudo: user.pseudo}})
			this.isClickREmoveFromBan = false;
		},
		async removeFromBan(user: {id: number, pseudo: string, profilPic: string, is42User: boolean})
	{
			this.isClickREmoveFromBan = true;
			try
			{
				const res = (await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels_users/unBan/`, {user: user, channel: this.channel}, {withCredentials: true})).data;
			}
			catch (e)
			{
				void e;
			}
			await this.getBannedUsers();
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

.circle
{
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
}

.list-users-banned
{
	max-height: 10em;
	overflow-y: auto;
	overflow-x: hidden;
}

.user-banned-pseudo
{
	color: var(--plight);
	cursor: pointer;
}

.user-banned
{
	margin-bottom: 1em;
	display: flex;
	align-items: center;
}

.user-banned .user-banned-pseudo:hover,
.user-banned div.circle:hover
{
	text-decoration: underline var(--plight);
}

.user-banned div
{
	display: inline-block;
	margin-right: 1em;
}

.user-banned div.circle
{
	width: 2em;
	height: 2em;
	border: 0.05em solid var(--plight);
	cursor: pointer;
}

.user-banned .circle img
{
	height: 100%;
}


.user-banned p
{
	display: inline-block;
}

.cross-icon
{
	margin-left: .5em;
	display: inline-block;
	cursor: pointer;
}

.text-error {
	text-align: center;
	color: red;
}
</style>
