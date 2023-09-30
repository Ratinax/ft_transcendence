<template>
  <div v-if="show" @click.self="close" class="modal-overlay">
    <div class="modal list-users-searched">
        <div class="user-searched" v-for="user in listUsersSearched" :key="user.id" @click="goToProfil(user)">
            <div class="circle">
                <img :src="user.profilPic">
            </div>
            <p class="user-searched-pseudo">{{ user.pseudo }}</p>
        </div>
    </div>
  </div>
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
            console.log('da', this.pseudo)
			if (this.pseudo) {
				this.listUsersSearched = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/users/${this.pseudo}`, {withCredentials: true})).data;
			}
		},
		close()
	{
			this.$emit('close');
		},
		goToProfil(user: {id: number, pseudo: string, profilPic: string, is42User: boolean})
	{
			this.router.push({name: 'UserPage', params: {pseudo: user.pseudo}})
		}
	}
});
</script>

<style>
.circle
{
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
}
.list-users-searched
{
	max-height: 10em;
	overflow-y: auto;
	overflow-x: hidden;
}
.user-searched-pseudo
{
	color: var(--plight);
}

.user-searched
{
	margin-bottom: 1em;
	display: flex;
	align-items: center;
	cursor: pointer;
}

.user-searched:hover
{
	text-decoration: underline var(--plight);
}

.user-searched div
{
	display: inline-block;
	margin-right: 1em;
}

.user-searched div.circle
{
	width: 2em;
	height: 2em;
	border: 0.05em solid var(--plight);
}

.user-searched .circle img
{
	height: 100%;
}


.user-searched p
{
	display: inline-block;
}
</style>
