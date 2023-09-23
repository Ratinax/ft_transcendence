<template>
	<div class="row user-page">
	<Menu />
		<div class="col user-page-content">
			<div class="col user-box">
				<div class="row user-profile">
					<div class="col user-profile-pic-and-name">
						<div class="profile-pic-container">
							<img :src="profilePic" alt="User profile picture"> 
						</div>
						<div class="row user-name-and-status">
						<div class="connect"></div>
							<p class="user-name text">{{ userName }}</p>
						</div>
					</div>
					<div class="col user-description">
						<p class="text">text</p>
					</div>
				</div>
			</div>
			<div class="row button-zone">
				<button v-if="showButtons && isBlocked" class="ft-button block-button" @click="unblockUser">UNBLOCK USER</button>
				<button v-if="showButtons && !isBlocked" class="ft-button block-button" @click="blockUser">BLOCK USER</button>
				<button v-if="showButtons && isFriend === 'accepted'" class="ft-button add-button" @click="removeFriend">REMOVE FRIEND</button>
				<button v-if="showButtons && isFriend === 'pending'" class="ft-button add-button" @click="removeFriend">REMOVE FRIEND REQUEST</button>
				<button v-if="showButtons && isFriend === ''" class="ft-button add-button" @click="addFriend">ADD FRIEND</button>
			</div>
			<div class="row user-box user-stats">
				<div class="col user-stat">
					<h1 class="text">Game(s) played</h1>
					<p class="text user-score fade-text">{{ userGamesPlayed }}</p>
				</div>
				<div class="col user-stat">
					<h1 class="text">Win rate</h1>
					<p class="text user-score fade-text winrate">{{userWinRate}}%</p>
				</div>
				<div class="col user-stat">
					<h1 class="text">Win(s)</h1>
					<p class="text user-score fade-text">{{ userWins }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, computed, onMounted, } from 'vue';
import { useRoute } from 'vue-router';
import Menu from "../components/Menu.vue"
import axios from 'axios';

export default defineComponent({
	name: 'UserPage',
	components: { Menu },
	setup() {
		const showButtons = ref<boolean>(false);
		const userName = ref('');
		const profilePic = ref(undefined)
		const userDescription = ref("userdescription");
		const userGamesPlayed = ref(23);
		const isBlocked = ref(false);
		const isFriend = ref('');
		const userWins = ref(12);
		const userWinRate = computed(() => {
			if (userGamesPlayed.value > 0) {
				return Math.round(userWins.value / userGamesPlayed.value * 100);
			}
			else {
				return 0;
			}
		})

		onMounted(async () => {
			const route = useRoute();
			if (typeof route.params.pseudo === 'string')
			userName.value = route.params.pseudo;
			const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/imageNameByPseudo/${userName.value}`, {withCredentials: true});
			profilePic.value = response.data;
			const response2 = await axios.get(`http://${process.env.VUE_APP_IP}:3000/games/games-wins/${userName.value}`, {withCredentials: true});
			userGamesPlayed.value = response2.data.nb_games;
			userWins.value = response2.data.nb_wins;
			showButtons.value = !(userName.value === (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/pseudo/`, {withCredentials: true})).data);
			isBlocked.value = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/blockships/isBlocked/${userName.value}`, {withCredentials: true})).data;
			isFriend.value = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/friendships/friendRelation/${userName.value}`, {withCredentials: true})).data;
		})

		async function	blockUser()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/blockships/block/`, {pseudo: userName.value}, {withCredentials: true});
				if (res.data === 'Success')
					isBlocked.value = true;
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function	unblockUser()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/blockships/unblock/`, {pseudo: userName.value}, {withCredentials: true});
				if (res.data === 'Success')
					isBlocked.value = false;
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function	addFriend()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/friendships/ask/`, {pseudo: userName.value}, {withCredentials: true});
				isFriend.value = res.data;
				console.log('value :', isFriend.value);
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function	removeFriend()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/friendships/remove/`, {pseudo: userName.value}, {withCredentials: true});
				isFriend.value = res.data;
				console.log('value2 :', isFriend.value);
			}
			catch (e)
			{
				console.error(e);
			}
		}
		return { userName, 
			profilePic, 
			userDescription, 
			userGamesPlayed, 
			userWins, 
			userWinRate, 
			showButtons,
			isBlocked,
			isFriend,
			blockUser, 
			unblockUser,
			removeFriend,
			addFriend };
	},
});
</script>

<style src="../assets/global.css" rel="stylesheet" lang="css"></style>
<style scoped>

.winrate {
	transform: scale(75%);
}

.text {
	color: white;
}

.user-page {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
	box-sizing: content-box;
	min-width: 450px;
	height: 100vh;
}

.user-page-content {
	margin: 2em auto;
	max-width: 960px;
	width: 100%;
	box-sizing: content-box;
}

/* User profile */
.user-box {
	box-shadow: var(--pcyan) 0px 0px 0px 2px, var(--pblue) 0px 4px 6px -1px, var(--pblue) 0px 1px 0px inset;
	background: var(--pdark);
	width: 100%;
}

.user-profile-pic-and-name {
	align-items: center;
	width: 40%;
	border-right: 1px solid var(--plight);
}

.profile-pic-container {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	width: 15em;
	height: 15em;
	margin: 1em 0; 
}

.profile-pic-container img {
	height: 100%;
}

.user-name-and-status {
	margin: .2em 0 1em 0;
	align-items: center;
}

.connect {
	border-radius: 50%;
	width: 1em;
	height: 1em;
	background: lime;
	margin-right: .5em;
	margin-top: 2%;
}

.user-name {
	font-size: 2em;
}

.user-description {
	padding: 2%;
}

/* Buttons */
.button-zone {
	width: 40%;
	justify-content: space-around;

	margin-top: 1em;
	margin-bottom: 4em;
}

.add-button {
	background: rgba(0, 255, 0, 0.875);
	box-shadow: 0 4px 0 green;
}

.add-button:hover {
	background: lime;
}

.block-button {
	background: rgb(251, 80, 80, 0.875);
	box-shadow: 0 4px 0 red;
}

.block-button:hover {
	background: rgb(251, 80, 80);
}

/* Stats */
.user-stats {
	justify-content: center;
}

.user-stat {
	width: 33%;
	align-items: center;
	padding-bottom: 1.5em;
}


.user-score {
	font-size: 9em;
	padding-top: .1em;
}

.user-win-rate {
	font-size: 2.5em;
}

/* Media queries */

@media (max-width: 1120px) {
	.row {
		flex-direction: column;
	}

	.user-page {
		flex-direction: row;
	}

	.user-page-content {
		width: 80%;
	}

	.user-stat {
		border-top: 2px solid var(--plight);
		width: 100%;
	}

	.button-zone {
		width: 100%;
	}

	.button-zone,
	.user-profile,
	.user-name-and-status {
		flex-direction: row;
	}
}

@media (max-width: 850px) {
	.user-profile {
		flex-direction: column;
	}

	.user-profile-pic-and-name {
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--plight);
	}

	.user-profile-pic {
		width: 30%;
	}
}
</style>
